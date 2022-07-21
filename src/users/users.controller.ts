import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  Delete,
  Logger,
  UseGuards,
  Controller,
  BadRequestException,
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
import CreateUserDTO from './dto/create-user.dto'
import { UserEntity } from './entities/user.entity'
import { Roles } from './decorators/roles.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { ReqUser } from './decorators/req-user.decorator'
import { QueryUsersDTO } from './dto/query-users.dto'
import UpdateEnableUserDTO from './dto/updateEnable-user.dto'
import { QueryUsersEntity } from './entities/query-users.entity'
import { UpdateUserEntity } from './entities/update-user.entity'
import { UpdatePasswordUserDto } from './dto/update-password-user.dto'
import { UpdateEnableUserEntity } from './entities/update-enable-user.entity'
import { UpdatePasswordUserEntity } from './entities/update-password-user.entity'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateEnableUserValidationPipe } from '../pipes/updateEnableUser-validation.pipe'
import { RegisterValidationPipe } from '../pipes/register-validation.pipe'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersController.name)

  //เพิ่มข้อมูลสมาชิก
  @Post('register')
  @ApiCreatedResponse({
    status: 200,
    description: 'The create user successfully',
    type: UserEntity,
  })
  async create(
    @Body(RegisterValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<User> {
    try {
      const { password } = createUserDTO
      const hasSaltSize = this.configService.get('hasSaltSize')
      const hashedPassword = await bcrypt.hash(password, hasSaltSize)
      return this.usersService.create({
        ...createUserDTO,
        password: hashedPassword,
      })
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //filter จาก ชื่อผู้ใช้งาน ชื่อ-นามสกุล, รายงานสมาชิกใหม่
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    status: 200,
    description: 'The update firstname and lastname user success',
    type: UpdatePasswordUserEntity,
  })
  @Put(':id/changed-password')
  @ApiBody({ type: UpdatePasswordUserDto })
  async updatePasswordUser(
    @ReqUser() reqUser: UserEntity,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ): Promise<UpdateUserDto> {
    try {
      const { _id: userId } = reqUser
      const { password } = updatePasswordUserDto
      const user = await this.usersService.findById(userId)
      const isNotMatch = await bcrypt.compare(password, user.password)
      if (isNotMatch) {
        throw new BadRequestException(`Password duplicate!!!`)
      }
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
  @UseGuards(JwtAuthGuard, RolesGuard)
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
    @Body() UpdateEnableUserDTO: UpdateEnableUserDTO,
  ): Promise<UpdateEnableUserDTO> {
    try {
      const userId = id
      if (UpdateEnableUserDTO.enabled) {
        return this.usersService.setEnable(userId)
      }
      return this.usersService.setDisable(userId)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //ลบข้อมูลสมาชิก
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.Admin)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      return this.usersService.deleteAndSetStatusUser(id)
    } catch (error) {
      this.logger.error(error?.message ?? JSON.stringify(error))
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
