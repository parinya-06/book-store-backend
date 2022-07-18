import { BadRequestException, Inject, PipeTransform } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { User } from '../users/schemas/user.schema'

export class UpdateEnableUserValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService

  async transform(value: any): Promise<User> {
    const userId = value
    const existingUsers = await this.usersService.findOneById(userId)
    if (!existingUsers) {
      throw new BadRequestException(`User not found`)
    }
    return value
  }
}
