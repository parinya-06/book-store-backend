import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { FilterQuery, Model } from 'mongoose'
import CreateUserDto from './dto/create-user.dto'
import { UpdateUsersDto } from './dto/update-user-dto'

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto)
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().lean()
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findOne({ _id: id }).lean()
  }

  async findUsers(username: string) {
    return this.userModel.find({ username: username }).lean()
  }

  async filterUser(filter: FilterQuery<UserDocument>) {
    return this.userModel.find(filter).lean()
  }

  async update(id: string, updateUsersDto: UpdateUsersDto) {
    return this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUsersDto }, { new: true })
      .lean()
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .lean()
    return `delete user by id:${deletedUser._id},username:${deletedUser.username} succesful!!!`
  }
}
