import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { UserEntity } from '../../users/entities/user.entity'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true })
  }

  //login ผิดพลาด 3 ครั้งจะถูกระงับ 30 วินาที
  async validate(
    req: any,
    username: string,
    password: string,
  ): Promise<UserEntity> {
    const IP = String(req.ip)
    const isBannedIp = await this.authService.getBannedIP(IP)
    if (isBannedIp) {
      throw new ForbiddenException({
        message: `User has been blocked!!!,Please wait 30 seconds.`,
      })
    }
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      const wrongLimit = await this.authService.isBannedIP(IP)
      if (wrongLimit) {
        await Promise.all([
          await this.authService.setBannedIP(IP, true),
          await this.authService.deleteCountWrongPassword(IP),
        ])
        throw new UnauthorizedException({
          message: `User has been blocked!!!,Please wait 30 seconds.`,
        })
      }
      throw new UnauthorizedException({
        message: `No Username and Password invalid!!!`,
      })
    }
    return user
  }
}
