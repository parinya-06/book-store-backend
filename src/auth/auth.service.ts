import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import {
  Inject,
  Injectable,
  CACHE_MANAGER,
  ForbiddenException,
} from '@nestjs/common'
import bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { Cache } from 'cache-manager'

import CreateUserDTO from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
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

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return this.userModel.create(createUserDTO)
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username)
    if (!UsersService.isActive(user)) {
      throw new ForbiddenException()
    }

    const { password: checkPassword } = user
    const isMatch = await bcrypt.compare(password, checkPassword)
    if (user && isMatch) {
      return user
    }
    return null
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
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }

  async getBanIpUser(ip: string, defaultValue = false): Promise<boolean> {
    const key = `baned:${ip}`
    const banIp = await this.cacheManager.get<boolean>(key)
    return banIp ?? defaultValue
  }

  async isBanedIp(ip: string, value: boolean): Promise<void> {
    const key = `baned:${ip}`
    await this.cacheManager.set(key, value, { ttl: 30 })
  }

  async getCountWrongPassword(ip: string, defaultValue = 0): Promise<number> {
    const key = `countWrongPassword:${ip}`
    const countWrongPassword = await this.cacheManager.get<number>(key)
    return countWrongPassword ?? defaultValue
  }

  async setCountWrongPassword(ip: string, count: number): Promise<number> {
    const key = `countWrongPassword:${ip}`
    return this.cacheManager.set(key, count, { ttl: 0 })
  }

  async deleteCountWrongPassword(ip: string): Promise<void> {
    const key = `countWrongPassword:${ip}`
    return this.cacheManager.del(key)
  }
}
