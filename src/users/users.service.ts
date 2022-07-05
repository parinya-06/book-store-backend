import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose'
import CreateUserDto from './dto/create-user.dto'
import { UpdateUsersDto } from './dto/update-user-dto'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findUsers(username: string) {
    return this.userModel.find({ username: username }).exec()
  }

  async filterUser(filter: string) {
    return this.userModel
      .find({ $or: [{ username: filter }, { name: filter }] })
      .exec()
  }
  async update(id: string, updateUsersDto: UpdateUsersDto) {
    const existingUsers = await this.userModel
      .findOneAndUpdate({ _id: id }, { $set: updateUsersDto }, { new: true })
      .exec()
    if (!existingUsers) {
      throw new NotFoundException(`User #${id} not found`)
    }
    return existingUsers
  }

  async delete(id: string) {
    const deletedUser = await this.userModel
      .findByIdAndRemove({ _id: id })
      .exec()
    console.log('deletedUser=', deletedUser)
    return `delete user by id:${deletedUser._id},username:${deletedUser.username} succesful!!!`
  }
}
