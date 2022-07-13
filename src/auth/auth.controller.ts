import { Controller, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import LoginDTO from './dto/login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  @ApiCreatedResponse({
    description: 'The record has been successfully logined.',
    type: LoginDTO,
  })
  async login(@Request() req) {
    return this.authService.login(req.user)
  }
}
