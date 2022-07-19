import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true })
  }

  //login ผิดพลาด 3 ครั้งจะถูกระงับ 30 วินาที
  async validate(req: any, username: string, password: string): Promise<any> {
    const ip = String(req.ip)
    const isBanedIp = await this.authService.getBanIpUser(ip)
    if (isBanedIp) {
      throw new ForbiddenException({
        message: `User has been blocked!!!,Please wait 30 seconds.`,
      })
    }
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      let countWrongPassword = await this.authService.getCountWrongPassword(ip)
      countWrongPassword += 1
      await this.authService.setCountWrongPassword(ip, countWrongPassword)
      if (countWrongPassword >= 3) {
        await this.authService.setBanIpUser(ip, true)
        await this.authService.deleteCountWrongPassword(ip)
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
