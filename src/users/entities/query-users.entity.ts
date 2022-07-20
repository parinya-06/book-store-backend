import { ApiProperty } from '@nestjs/swagger'
import { User } from '../schemas/user.schema'
import { UserEntity } from '../../auth/entities/user.entity'

export class QueryUsersEntity {
  @ApiProperty({
    type: String,
    required: false,
  })
  page: number

  @ApiProperty({
    type: String,
    required: false,
  })
  perPage: number

  @ApiProperty({
    type: User,
    required: false,
    example: UserEntity,
  })
  records: User[]

  @ApiProperty({
    type: Number,
    required: false,
  })
  count: number
}
