import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    const [{ password: checkPassword }] = user
    const isMatch = await bcrypt.compare(password, checkPassword)
    if (user && isMatch) {
      const [{ password, ...result }] = user
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id }
    const tokens = await this.getTokens(payload)
    await this.updateRefreshToken(user._id, tokens.refreshToken)
    return tokens
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.update(userId, {
      refreshToken: refreshToken,
    })
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
}
