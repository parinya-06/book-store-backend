import {
  Post,
  Logger,
  Request,
  UseGuards,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import LoginDTO from './dto/login.dto'
import { AuthService } from './auth.service'
import { LoginEntity } from './entities/login.entity'
import { LocalAuthGuard } from './guards/local-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
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
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
