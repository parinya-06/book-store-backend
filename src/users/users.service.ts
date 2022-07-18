import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model, SortOrder } from 'mongoose'

import { UpdateUserDTO } from './dto/update-user-dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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
        .select({ passcode: 0 })
        .lean(),
      this.userModel.countDocuments(filter as User),
    ])
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean()
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).lean()
  }

  async update(
    id: string,
    updateUsersDTO: UpdateUserDTO,
  ): Promise<UpdateUserDTO> {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUsersDTO }, { new: true })
      .lean()
  }

  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndRemove({ _id: id }).lean()
  }
}
