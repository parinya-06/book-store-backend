import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

import { AuthService } from '../auth.service'
import { UserEntity } from '../entities/user.entity'

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
    const ip = String(req.ip)
    const isBanedIp = await this.authService.getBanIpUser(ip)
    if (isBanedIp) {
      throw new ForbiddenException({
        message: `User has been blocked!!!,Please wait 30 seconds.`,
      })
    }
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      let getCountWrongPasswordByIp =
        await this.authService.getCountWrongPassword(ip)
      getCountWrongPasswordByIp += 1
      await this.authService.setCountWrongPassword(
        ip,
        getCountWrongPasswordByIp,
      )
      if (getCountWrongPasswordByIp >= 3) {
        await Promise.all([
          await this.authService.isBanedIp(ip, true),
          await this.authService.deleteCountWrongPassword(ip),
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
