import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import {
  Post,
  Body,
  Logger,
  Request,
  UseGuards,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common'
import bcrypt from 'bcrypt'

import LoginDTO from './dto/login.dto'
import { AuthService } from './auth.service'
import CreateUserDTO from './dto/create-user.dto'
import { LoginEntity } from './entities/login.entity'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { CreateUserEntity } from './entities/create-user.entity'

import { User } from '../users/schemas/user.schema'
import { RegisterValidationPipe } from '../pipes/register-validation.pipe'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthController.name)

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  @ApiCreatedResponse({
    status: 200,
    description: 'The record has been successfully login.',
    type: LoginEntity,
  })
  async login(@Request() req): Promise<LoginEntity> {
    try {
      return this.authService.login(req.user)
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //เพิ่มข้อมูลสมาชิก
  @Post('register')
  @ApiCreatedResponse({
    status: 200,
    description: 'The create user successfully',
    type: CreateUserEntity,
  })
  async create(
    @Body(RegisterValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<User> {
    try {
      const hasSaltSize = this.configService.get('hasSaltSize')
      const { password } = createUserDTO
      const hashedPassword = await bcrypt.hash(password, hasSaltSize)
      return this.authService.create({
        ...createUserDTO,
        password: hashedPassword,
      })
    } catch (error) {
      this.logger.error(error.message)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
