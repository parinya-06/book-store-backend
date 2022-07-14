import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import * as bcrypt from 'bcrypt'
import { UsersService } from './users.service'
import { User } from './schemas/user.schema'
import FilterUserDTO from './dto/filter-user.dto'
import CreateUserDTO from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user-dto'
import EnabledUserDTO from './dto/enabled-user.dto'
import { PaginationQueryDTO } from './dto/pagination-query.dto'

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new Logger(UsersController.name)

  @Get('all/:pagination')
  getUserAll(@Query() paginationQuery: PaginationQueryDTO): Promise<User[]> {
    return this.usersService.findAll(paginationQuery)
  }

  @Get('report/newusers')
  async getReport() {
    const newUsers = await this.usersService.reportNewUsers()
    if (newUsers.length === 0) {
      throw new BadRequestException(`No New User!!!`)
    }
    const qtyUsers = newUsers.length
    const dataReport = [
      {
        qtyNewUsers: qtyUsers,
        newUsers: newUsers,
      },
    ]
    return dataReport
  }

  @Get('filter/:filter')
  getUserFilter(@Query() filter: FilterUserDTO): Promise<User[]> {
    if (filter) {
      return this.usersService.filterUsers(filter)
    }
    return null
  }

  @Post('register')
  async create(@Body() createUserDTO: CreateUserDTO) {
    const userExists = await this.usersService.findByUsername(
      createUserDTO.username,
    )
    if (userExists.length != 0) {
      throw new BadRequestException(`User already exists`)
    }
    const saltOrRounds = 10
    const password = createUserDTO.password
    const hashPassword = await bcrypt.hash(password, saltOrRounds)
    return this.usersService.create({
      ...createUserDTO,
      password: hashPassword,
    })
  }

  @Put(':id')
  @ApiBody({ type: CreateUserDTO })
  async update(@Param('id') id: string, @Body() updateUsersDTO: UpdateUserDTO) {
    try {
      const existingUsers = await this.usersService.findById(id)
      if (!existingUsers) {
        throw new BadRequestException(`User #${id} not found`)
      }
      const saltOrRounds = 10
      const password = updateUsersDTO.password
      const hashPassword = await bcrypt.hash(password, saltOrRounds)
      return this.usersService.update(id, {
        ...updateUsersDTO,
        password: hashPassword,
      })
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  @Put(':id/enabled')
  @ApiBody({ type: EnabledUserDTO })
  async enabledUser(
    @Param('id') id: string,
    @Body() updateUsersDTO: UpdateUserDTO,
  ) {
    try {
      const existingUser = await this.usersService.findById(id)
      if (!existingUser) {
        throw new BadRequestException(`User #${id} not found`)
      }
      return this.usersService.update(id, updateUsersDTO)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException()
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id)
  }
}
