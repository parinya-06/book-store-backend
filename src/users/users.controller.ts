import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import * as bcrypt from 'bcrypt'
import { FilterQuery } from 'mongoose'

import { User } from './schemas/user.schema'
import { UsersService } from './users.service'
import CreateUserDTO from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user-dto'
import { PaginationQueryDto } from './dto/pagination-query.dto'

import { UpdateValidationPipe } from '../pipes/update-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UpdateEnableUserValidationPipe } from '../pipes/updateEnableUser-validation.pipe'
import { RolesValidationPipe } from '../pipes/roles-validation.pipe'

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UsersController.name)

  //filter จาก ชื่อผู้ใช้งาน ชื่อ-นามสกุล, รายงานสมาชิกใหม่
  @UseGuards(JwtAuthGuard)
  @UsePipes(RolesValidationPipe) //เช็คว่าเป็น admin?
  @Get()
  async getUsers(@Query() query: PaginationQueryDto): Promise<any> {
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
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //แก้ไขข้อมูลสมาชิก
  @UseGuards(JwtAuthGuard)
  @Put()
  @ApiBody({ type: CreateUserDTO })
  async update(
    @Req() req,
    @Body(UpdateValidationPipe) updateUsersDTO: UpdateUserDTO,
  ): Promise<UpdateUserDTO> {
    try {
      const { userId } = req.user
      const { password } = updateUsersDTO
      if (password) {
        const saltOrRounds = this.configService.get('saltOrRounds')
        const hashedPassword = await bcrypt.hash(password, saltOrRounds)
        return this.usersService.update(userId, {
          ...updateUsersDTO,
          password: hashedPassword,
        })
      }
      return this.usersService.update(userId, updateUsersDTO)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //ระงับการใช้งานของสมาชิก
  @UseGuards(JwtAuthGuard)
  @UsePipes(RolesValidationPipe) //เช็คว่าเป็น admin?
  @Put(':id/enabled')
  async updateEnableUser(
    @Param('id', UpdateEnableUserValidationPipe) id: string,
    @Body() updateUsersDTO: UpdateUserDTO,
  ): Promise<UpdateUserDTO> {
    try {
      return this.usersService.update(id, updateUsersDTO)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }

  //ลบข้อมูลสมาชิก
  @UseGuards(JwtAuthGuard)
  @UsePipes(RolesValidationPipe) //เช็คว่าเป็น admin?
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<User> {
    try {
      return this.usersService.delete(id)
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException({
        message: error.message ?? error,
      })
    }
  }
}
