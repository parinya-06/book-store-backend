import { ApiProperty } from '@nestjs/swagger'

export class UpdateEnableUserEntity {
  @ApiProperty({
    type: String,
    required: true,
    example: false,
  })
  enabled: boolean
}
