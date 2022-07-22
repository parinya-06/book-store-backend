import { ApiProperty } from '@nestjs/swagger'
import { ERole } from '../enums/enum-role'
import { UserStatus } from '../enums/enum-status'

export class UserEntity {
  @ApiProperty({
    type: String,
    example: '62d62832a8ced896dd692389',
  })
  _id: string

  @ApiProperty({
    type: String,
    example: 'test123',
  })
  username: string

  @ApiProperty({
    type: String,
    example: 'test',
  })
  firstname: string

  @ApiProperty({
    type: String,
    example: '123',
  })
  lastname?: string

  @ApiProperty({
    type: String,
    example: ERole.User,
  })
  role: ERole

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  enabled: boolean

  @ApiProperty({
    type: String,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus

  @ApiProperty({
    type: String,
    required: true,
    example: '2022-07-19T03:42:42.049Z',
  })
  createdAt: Date

  @ApiProperty({
    type: String,
    required: true,
    example: '2022-07-19T03:42:42.049Z',
  })
  updatedAt: Date
}
