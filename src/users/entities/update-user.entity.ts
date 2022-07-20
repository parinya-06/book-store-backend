import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserEntity {
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
}
