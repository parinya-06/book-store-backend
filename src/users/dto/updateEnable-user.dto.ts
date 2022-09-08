import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty } from 'class-validator'

class UpdateEnableUserDTO {
  @ApiProperty({
    type: Boolean,
    example: false,
  })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean
}
export default UpdateEnableUserDTO
