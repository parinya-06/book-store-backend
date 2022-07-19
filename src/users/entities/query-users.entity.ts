import { ApiProperty } from '@nestjs/swagger'

export class QueryUsersEntity {
  @ApiProperty({
    type: String,
    required: false,
    example: '1',
  })
  page: string

  @ApiProperty({
    type: String,
    required: false,
    example: '1',
  })
  perPage: string

  @ApiProperty({
    type: String,
    required: false,
    example: [{}],
  })
  records: object[]

  @ApiProperty({
    type: Number,
    required: false,
    example: 1,
  })
  count: number
}
