import { ApiProperty } from '@nestjs/swagger'

export class UpdateEnableUserEntity {
  @ApiProperty({
    type: String,
    example: false,
  })
  enabled: boolean
}
