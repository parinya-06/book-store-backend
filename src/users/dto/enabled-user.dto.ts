import { ApiProperty } from '@nestjs/swagger'

class EnabledUserDto {
  @ApiProperty({ type: Boolean, example: true })
  enabled: boolean
}

export default EnabledUserDto
