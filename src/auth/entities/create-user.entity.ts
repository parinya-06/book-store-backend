import { ApiProperty } from '@nestjs/swagger'

export class CreateUserEntity {
  @ApiProperty({
    type: String,
    required: true,
    example: '62d62832a8ced896dd692389',
  })
  _id: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'test123',
  })
  username: string

  @ApiProperty({
    type: String,
    required: true,
    example: '$2b$10$K7XsFyBpB1iD.RhAk1GYYuXm2pVAbvi9e4kbogrGhZ4f7j2AzPuq.',
  })
  password: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'test',
  })
  firstname: string

  @ApiProperty({
    type: String,
    required: true,
    example: '123',
  })
  lastname: string

  @ApiProperty({
    type: String,
    required: true,
    example: 'user',
  })
  roles: string

  @ApiProperty({
    type: Boolean,
    required: true,
    example: false,
  })
  enabled: false

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
