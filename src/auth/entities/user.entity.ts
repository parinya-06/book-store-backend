import { ApiProperty } from '@nestjs/swagger'

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
  lastname: string

  @ApiProperty({
    type: String,
    example: 'user',
  })
  roles: string

  @ApiProperty({
    type: Boolean,
    example: false,
  })
  enabled: false

  @ApiProperty({
    type: Boolean,
    example: true,
  })
  status: true

  @ApiProperty({
    type: String,
    required: true,
    example: '2022-07-19T03:42:42.049Z',
  })
  createdAt: string

  @ApiProperty({
    type: String,
    required: true,
    example: '2022-07-19T03:42:42.049Z',
  })
  updatedAt: string
}
