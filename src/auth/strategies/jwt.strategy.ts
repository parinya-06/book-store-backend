import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { User } from '../../users/schemas/user.schema'
import { UsersService } from '../../users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('authentication.secretJwt'),
    })
  }

  async validate(payload, done) {
    const { userId } = payload
    let user: User
    try {
      user = await this.usersService.findById(userId)
    } catch (error) {
      throw new InternalServerErrorException()
    }

    const { password, ...result } = user
    done(null, result)
  }
}
