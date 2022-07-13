import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'
import CreateUserDTO from './dto/create-user.dto'
import { UpdateUserDTO } from './dto/update-user-dto'
import { PaginationQueryDTO } from './dto/pagination-query.dto'

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    return this.userModel.create(createUserDTO)
  }

  async findAll(paginationQuery: PaginationQueryDTO): Promise<User[]> {
    const { limit, offset } = paginationQuery
    return this.userModel.find().skip(offset).limit(limit).lean()
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean()
  }

  async findByUsername(username: string) {
    return this.userModel.find({ username }).lean()
  }

  async filterUsers(filter: FilterQuery<UserDocument>) {
    return this.userModel.find(filter).lean()
  }

  async reportNewUsers(): Promise<User[]> {
    const nowTime = new Date()
    const today = nowTime.toLocaleDateString(`fr-CA`).split('/').join('-')
    return this.userModel
      .find({
        createdAt: {
          $gte: `${today}T00:00:00.000+00:00`,
          $lte: `${today}T23:59:59.999+00:00`,
        },
      })
      .lean()
  }

  async update(id: string, updateUsersDTO: UpdateUserDTO) {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUsersDTO }, { new: true })
      .lean()
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .lean()
    return `delete user by id:${deletedUser._id},username:${deletedUser.username} succesful!!!`
  }
}
