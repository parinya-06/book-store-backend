import {
  BadRequestException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common'
import { CONTEXT } from '@nestjs/microservices'
import { UsersService } from '../users/users.service'

@Injectable({ scope: Scope.REQUEST })
export class UpdateValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService
  @Inject(CONTEXT) private readonly context

  async transform(value: any) {
    const userId = await this.context.user.userId
    const existingUsers = await this.usersService.findOneById(userId)
    if (!existingUsers) {
      throw new BadRequestException(`User not found`)
    }
    return value
  }
}
