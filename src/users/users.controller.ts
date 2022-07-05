import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import CreateUserDto from './dto/create-user.dto'
import { User } from './schemas/user.schema'
import { UpdateUsersDto } from './dto/update-user-dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  getUserAll(): Promise<User[]> {
    return this.usersService.findAll()
  }
  @Get(':filter')
  getUserFilter(@Query('username&name') filter: string): Promise<User[]> {
    return this.usersService.filterUser(filter)
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Patch(':id')
  @ApiBody({ type: CreateUserDto })
  update(@Param('id') id: string, @Body() updateUsersDto: UpdateUsersDto) {
    return this.usersService.update(id, updateUsersDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}
