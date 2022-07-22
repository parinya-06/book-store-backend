import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, SortOrder } from 'mongoose'

import { ERole } from './enums/enum-role'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'
import { UpdatePasswordUserDto } from './dto/update-password-user.dto'
import CreateUserDTO from './dto/create-user.dto'
import UpdateEnableUserDTO from './dto/updateEnable-user.dto'
import { UserStatus } from './enums/enum-status'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return this.userModel.create(createUserDTO)
  }

  async pagination(
    filter: FilterQuery<User>,
    pagination?: { page: number; perPage: number },
    sort: { [key: string]: SortOrder } | string = { createdAt: -1 },
  ): Promise<[User[], number]> {
    const { page = 1, perPage = 20 } = pagination
    return Promise.all([
      this.userModel
        .find(filter as User)
        .sort(sort)
        .skip((page - 1) * +perPage)
        .limit(+perPage)
        .select({ password: 0 })
        .lean(),
      this.userModel.countDocuments(filter as User),
    ])
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean()
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).lean()
  }

  async update(
    id: string,
    updateUsersDTO: UpdateUserDto | UpdatePasswordUserDto,
  ): Promise<UpdateUserDto> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUsersDTO }, { new: true })
      .lean()
  }

  async setEnable(id: string): Promise<UpdateEnableUserDTO> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: { enabled: true } }, { new: true })
      .lean()
  }

  async setDisable(id: string): Promise<UpdateEnableUserDTO> {
    return this.userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { enabled: false } },
        { new: true },
      )
      .lean()
  }

  async deleteAndSetStatusUser(id: string) {
    await this.userModel
      .findOneAndUpdate(
        { _id: id },
        { $set: { status: UserStatus.DISABLED } },
        { new: true },
      )
      .lean()
  }

  static isActive(user: User): boolean {
    return user?.status === UserStatus.ACTIVE
  }

  static matchRoles(roles: ERole[], userRoles: ERole) {
    return roles.some((role) => userRoles.includes(role))
  }
}
