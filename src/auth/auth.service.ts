import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { Cache } from 'cache-manager'

import CreateUserDTO from './dto/create-user.dto'
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
    const { password: checkPassword } = user
    const isMatch = await bcrypt.compare(password, checkPassword)
    if (user && isMatch) {
      await this.cacheManager.reset()
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = {
      roles: user.roles,
      sub: user._id,
    }
    const tokens = await this.createTokens(payload)
    return tokens
  }

  async createTokens(payload: object) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
    ])
    return {
      accessToken,
      refreshToken,
    }
  }

  async getBanIpUser(ip: string): Promise<any> {
    const key = `baned:${ip}`
    return this.cacheManager.get(key)
  }

  async setBanIpUser(ip: string, value?: boolean): Promise<any> {
    const key = `baned:${ip}`
    return this.cacheManager.set(key, value, 30)
  }

  async getCountWrongPassword(ip: string, defaultValue = 0): Promise<number> {
    const key = `countWrongPassword:${ip}`
    const countWrongPassword = await this.cacheManager.get<number>(key)
    return countWrongPassword ?? defaultValue
  }

  async setCountWrongPassword(ip: string, count: number): Promise<any> {
    const key = `countWrongPassword:${ip}`
    return this.cacheManager.set(key, count, 0)
  }

  async deleteCountWrongPassword(ip: string): Promise<any> {
    const key = `countWrongPassword:${ip}`
    return this.cacheManager.del(key)
  }
}
