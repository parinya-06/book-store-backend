import {
  ForbiddenException,
  Inject,
  Injectable,
  PipeTransform,
  Scope,
} from '@nestjs/common'
import { CONTEXT } from '@nestjs/microservices'
import { UsersService } from '../users/users.service'

@Injectable({ scope: Scope.REQUEST })
export class RolesValidationPipe implements PipeTransform {
  @Inject() private readonly usersService: UsersService
  @Inject(CONTEXT) private readonly context

  async transform(value: any) {
    const userId = await this.context.user.userId
    const user = await this.usersService.findOneById(userId)
    const { roles } = user
    if (roles !== 'admin') {
      throw new ForbiddenException({
        message: `No Permission`,
      })
    }
    return value
  }
}
