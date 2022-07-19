import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserEntity {
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
}
