import { ConfigService } from '@nestjs/config'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import bcrypt from 'bcrypt'

import LoginDTO from './dto/login.dto'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

import { User } from '../users/schemas/user.schema'
import CreateUserDTO from '../users/dto/create-user.dto'
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
    description: 'The record has been successfully logined.',
    type: LoginDTO,
  })
  async login(@Request() req) {
    try {
      return this.authService.login(req.user)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //เพิ่มข้อมูลสมาชิก
  @Post('register')
  async create(
    @Body(RegisterValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<User> {
    try {
      const saltOrRounds = this.configService.get('saltOrRounds')
      const { password } = createUserDTO
      const hashedPassword = await bcrypt.hash(password, saltOrRounds)
      return this.authService.create({
        ...createUserDTO,
        password: hashedPassword,
      })
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
