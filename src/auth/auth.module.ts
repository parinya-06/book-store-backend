import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { CacheModule, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module'

import { jwtConstants } from './constants'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'

import { UsersModule } from '../users/users.module'
import { User, UserSchema } from '../users/schemas/user.schema'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CacheModule.register(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '15m' },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
