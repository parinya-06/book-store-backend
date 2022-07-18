import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ERole } from '../enums/enum-role'
import { UsersService } from '../users.service'

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject() private readonly reflector: Reflector
  @Inject() private readonly usersService: UsersService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<ERole[]>('roles', context.getHandler())
    if (!roles) {
      return true
    }
    const request = context.switchToHttp().getRequest()
    const user = await request.user
    const { roles: userRoles } = user

    return UsersService.matchRoles(roles, userRoles)
  }
}
