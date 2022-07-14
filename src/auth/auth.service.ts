import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Cache } from 'cache-manager'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username)
    try {
      const [{ password: checkPassword, enabled }] = user
      if (!enabled) {
        return false
      }
      const cachePassword: string = await this.cacheManager.get(username)
      const indexLogin: number = await this.cacheManager.get('indexLogin')
      if (!cachePassword) {
        await this.cacheManager.set(username, checkPassword, { ttl: 1000 })
        const isMatch = await bcrypt.compare(password, checkPassword)
        if (user && isMatch) {
          const [{ password, ...result }] = user
          await this.cacheManager.reset()
          return result
        }
      }
      if (!indexLogin) {
        await this.cacheManager.set('indexLogin', 1, { ttl: 1000 })
      }
      for (let i = 1; i <= indexLogin; i++) {
        if (i === 1) {
          await this.cacheManager.set('indexLogin', 2, { ttl: 1000 })
        }
        if (i === 2) {
          await this.cacheManager.set('indexLogin', 3, { ttl: 30 })
        }
      }
      const isMatch = await bcrypt.compare(password, cachePassword)
      if (user && isMatch) {
        const [{ password, ...result }] = user
        await this.cacheManager.reset()
        return result
      }
    } catch (error) {
      return null
    }
    const indexLogin: number = await this.cacheManager.get('indexLogin')
    if (indexLogin === 3) {
      const [{ _id }] = user
      await this.usersService.update(_id, {
        enabled: false,
      })
      await this.updateBlockLogin(_id)
      throw new UnauthorizedException(
        `User has been blocked!!!,Please wait 30 seconds.`,
      )
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

  async updateBlockLogin(userId: string) {
    setInterval(async () => {
      await this.cacheManager.reset()
      await this.usersService.update(userId, {
        enabled: true,
      })
    }, 30000)
  }
}
