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
    const ip = req.ip
    const isBanedIp = await this.authService.getBanIpUser(`${ip}`)
    if (isBanedIp) {
      throw new ForbiddenException({
        message: `User has been blocked!!!,Please wait 30 seconds.`,
      })
    }
    const user = await this.authService.validateUser(username, password)
    if (!user) {
      const count = (await this.authService.getCountWrongPassword(`${ip}`)) ?? 0
      const wrong = count + 1
      await this.authService.setCountWrongPassword(`${ip}`, wrong, 0)
      if (wrong >= 3) {
        await this.authService.setBanIpUser(`${ip}`, true, 30)
        await this.authService.deleteCountWrongPassword(`${ip}`)
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
