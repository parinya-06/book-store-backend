import { ApiProperty } from '@nestjs/swagger'

export class UpdatePasswordUserEntity {
  @ApiProperty({
    type: String,
    example: '$2b$10$K7XsFyBpB1iD.RhAk1GYYuXm2pVAbvi9e4kbogrGhZ4f7j2AzPuq.',
  })
  password: string
}
