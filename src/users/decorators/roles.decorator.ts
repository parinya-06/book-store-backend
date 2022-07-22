import { SetMetadata } from '@nestjs/common'
import { ERole } from '../enums/enum-role'

export const Roles = (...roles: ERole[]) => SetMetadata('roles', roles)
