import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import CreateUserDto from './dto/create-user.dto'
import { User } from './schemas/user.schema'
import { UpdateUsersDto } from './dto/update-user-dto'
import FilterUserDto from './dto/filter-user.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name)

  @Get()
  getUserAll(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Get(':filter')
  getUserFilter(@Query() filter: FilterUserDto): Promise<User[]> {
    if (filter.username) {
      return this.usersService.filterUser(filter)
    }
    if (filter.firstname) {
      return this.usersService.filterUser(filter)
    }
    if (filter.lastname) {
      return this.usersService.filterUser(filter)
    }
    return null
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Put(':id')
  @ApiBody({ type: CreateUserDto })
  async update(
    @Param('id') id: string,
    @Body() updateUsersDto: UpdateUsersDto,
  ) {
    try {
      const existingUsers = await this.usersService.findById(id)
      if (!existingUsers) {
        throw new NotFoundException(`User #${id} not found`)
      } else {
        return this.usersService.update(id, updateUsersDto)
      }
    } catch (error) {
      this.logger.error(error)
      throw new NotFoundException(`User #${id} not found`)
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}