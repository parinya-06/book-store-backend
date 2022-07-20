import {
  Get,
  Put,
  Body,
  Param,
  Query,
  Delete,
  Logger,
  UseGuards,
  Controller,
  InternalServerErrorException,
} from '@nestjs/common'
import {
  ApiBody,
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import bcrypt from 'bcrypt'
import { FilterQuery } from 'mongoose'

import { ERole } from './enums/enum-role'
import { User } from './schemas/user.schema'
import { UsersService } from './users.service'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReqUser } from './decorators/req-user.decorator'
import { QueryUsersDTO } from './dto/pagination-query.dto'
import UpdateEnableUserDTO from './dto/updateEnable-user.dto'
import { QueryUsersEntity } from './entities/query-users.entity'
import { UpdateUserEntity } from './entities/update-user.entity'
import { UpdatePasswordUserDto } from './dto/update-password-user.dto'
import { UpdateEnableUserEntity } from './entities/update-enable-user.entity'
import { UpdatePasswordUserEntity } from './entities/update-password-user.entity'

import { UserEntity } from '../auth/entities/user.entity'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateEnableUserValidationPipe } from '../pipes/updateEnableUser-validation.pipe'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersController.name)

  //filter จาก ชื่อผู้ใช้งาน ชื่อ-นามสกุล, รายงานสมาชิกใหม่
  @UseGuards(RolesGuard)
  @Roles(ERole.Admin)
  @ApiCreatedResponse({
    status: 200,
    description: 'The query users success',
    type: QueryUsersEntity,
  })
  @Get()
  async getUsers(@Query() query: QueryUsersDTO): Promise<QueryUsersEntity> {
    const {
      page,
      perPage,
      username,
      firstname,
      lastname,
      startDate,
      endDate,
      sort,
      ...result
    } = query
    const filters: FilterQuery<User> = result
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      }
    }
    if (username) {
      filters.username = username
    }
    if (firstname) {
      filters.firstname = firstname
    }
    if (lastname) {
      filters.lastname = lastname
    }
    try {
      const pagination = {
        page,
        perPage,
      }
      const [records, count] = await this.usersService.pagination(
        filters,
        pagination,
        sort,
      )
      return {
        ...pagination,
        records,
        count,
      }
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //แก้ไขข้อมูลสมาชิก
  @ApiCreatedResponse({
    status: 200,
    description: 'The update firstname and lastname user success',
    type: UpdateUserEntity,
  })
  @Put()
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @ReqUser() reqUser: UserEntity,
    @Body() updateUsersDTO: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      const { _id: userId } = reqUser
      return this.usersService.update(userId, updateUsersDTO)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //แก้ไขรหัสผ่าน
  @ApiCreatedResponse({
    status: 200,
    description: 'The update firstname and lastname user success',
    type: UpdatePasswordUserEntity,
  })
  @Put('password')
  @ApiBody({ type: UpdatePasswordUserDto })
  async updatePasswordUser(
    @ReqUser() reqUser: UserEntity,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<UpdateUserDto> {
    try {
      const { _id: userId } = reqUser
      const { password } = updatePasswordUserDto
      const hasSaltSize = this.configService.get('hasSaltSize')
      const hashedPassword = await bcrypt.hash(password, hasSaltSize)
      return this.usersService.update(userId, {
        ...updatePasswordUserDto,
        password: hashedPassword,
      })
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //ระงับการใช้งานของสมาชิก
  @UseGuards(RolesGuard)
  @Roles(ERole.Admin)
  @ApiBody({ type: UpdateEnableUserDTO })
  @ApiCreatedResponse({
    status: 200,
    description: 'The update enabled user success',
    type: UpdateEnableUserEntity,
  })
  @Put(':id/enabled')
  async updateEnableUser(
    @Param('id', UpdateEnableUserValidationPipe) id: string,
    @Body() updateUsersDTO: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      return this.usersService.update(id, updateUsersDTO)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //ลบข้อมูลสมาชิก
  @UseGuards(RolesGuard)
  @Roles(ERole.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.usersService.delete(id)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
