import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { LocalAuthGuard } from './auth/guards/local-auth.guard'
import { AuthService } from './auth/auth.service'
import loginDto from './auth/dto/login.dto'
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiBody({ type: loginDto })
  @ApiCreatedResponse({
    description: 'The record has been successfully logined.',
    type: loginDto,
  })
  async login(@Request() req) {
    console.log('login')
    // console.log(req)
    return this.authService.login(req.user)
  }
}
