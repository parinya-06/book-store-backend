import { ApiProperty } from '@nestjs/swagger'
import { User } from '../schemas/user.schema'

export class QueryUsersEntity {
  @ApiProperty({
    type: Number,
    required: false,
  })
  page: number

  @ApiProperty({
    type: Number,
    required: false,
  })
  perPage: number

  @ApiProperty({
    type: [Object],
    example: {
      _id: '62d8f368da914c01b7c76de6',
      username: 'admin1234',
      firstname: 'admin',
      lastname: '1234',
      role: 'admin',
      enabled: true,
      status: 'active',
      createdAt: '2022-07-21T06:34:16.784Z',
      updatedAt: '2022-07-22T02:43:36.186Z',
    },
  })
  records: User[]

  @ApiProperty({
    type: Number,
    required: false,
  })
  count: number
}
