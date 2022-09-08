import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { Cache } from 'cache-manager'

import { UserEntity } from '../users/entities/user.entity'
import { LoginEntity } from './entities/login.entity'

import { UsersService } from '../users/users.service'
import { User, UserDocument } from '../users/schemas/user.schema'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    if (!UsersService.isActive(user)) {
      throw new ForbiddenException()
    }

    const { password: checkPassword } = user
    const isMatch = await bcrypt.compare(password, checkPassword)
    if (user && isMatch) {
      return user
    }
    throw new UnauthorizedException({
      message: `No Username and Password invalid!!!`,
    })
  }

  async login(user: UserEntity): Promise<LoginEntity> {
    const payload = {
      userId: user._id,
    }
    return this.createTokens(payload)
  }

  async createTokens(payload): Promise<LoginEntity> {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN,
      }),
    }
  }

  async getBannedIP(IP: string, defaultValue = false): Promise<boolean> {
    const key = `baned:${IP}`
    const banIP = await this.cacheManager.get<boolean>(key)
    return banIP ?? defaultValue
  }

  async isBannedIP(IP: string): Promise<boolean> {
    const wrongLimit = 3
    let wrongCount = await this.getCountWrongPassword(IP)
    wrongCount += 1
    await this.setCountWrongPassword(IP, wrongCount)
    return wrongCount >= wrongLimit
  }

  async setBannedIP(IP: string, value: boolean): Promise<void> {
    const key = `baned:${IP}`
    await this.cacheManager.set(key, value, { ttl: 30 })
  }

  async getCountWrongPassword(IP: string, defaultValue = 0): Promise<number> {
    const key = `countWrongPassword:${IP}`
    const countWrongPassword = await this.cacheManager.get<number>(key)
    return countWrongPassword ?? defaultValue
  }

  async setCountWrongPassword(IP: string, count: number): Promise<number> {
    const key = `countWrongPassword:${IP}`
    return this.cacheManager.set(key, count, { ttl: 0 })
  }

  async deleteCountWrongPassword(IP: string): Promise<void> {
    const key = `countWrongPassword:${IP}`
    return this.cacheManager.del(key)
  }
}
