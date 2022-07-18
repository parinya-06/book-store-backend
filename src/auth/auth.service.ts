import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { Cache } from 'cache-manager'

import { UsersService } from '../users/users.service'
import CreateUserDTO from '../users/dto/create-user.dto'
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
      username: user.username,
      roles: user.roles,
      sub: user._id,
    }
    const tokens = await this.getTokens(payload)
    return tokens
  }

  async getTokens(payload: object) {
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
    return this.cacheManager.get(`baned:${ip}`)
  }

  async setBanIpUser(
    ip: string,
    value?: number | boolean,
    ttl?: number,
  ): Promise<any> {
    return this.cacheManager.set(`baned:${ip}`, value, ttl)
  }

  async getCountWrongPassword(ip: string): Promise<any> {
    return this.cacheManager.get(`countWrongPassword:${ip}`)
  }

  async setCountWrongPassword(
    ip: string,
    value?: any,
    ttl?: number,
  ): Promise<any> {
    return this.cacheManager.set(`countWrongPassword:${ip}`, value, ttl)
  }

  async deleteCountWrongPassword(ip: string): Promise<any> {
    return this.cacheManager.del(`countWrongPassword:${ip}`)
  }
}
