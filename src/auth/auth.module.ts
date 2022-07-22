import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module'
import redisStore from 'cache-manager-redis-store'

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
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('database.redis.redisHost'),
        port: configService.get<number>('database.redis.redisPort'),
        ttl: configService.get<number>('database.redis.redisTtl'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('authentication.secretJwt'),
        signOptions: configService.get('authentication.signOptions'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
