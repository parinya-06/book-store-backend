import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

class EnabledUserDTO {
  @ApiProperty({ type: Boolean, example: true })
  @IsBoolean()
  @IsNotEmpty()
  enabled: boolean
}

export default EnabledUserDTO
