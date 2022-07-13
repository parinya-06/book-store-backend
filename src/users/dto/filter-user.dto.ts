import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

class FilterUserDTO {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  firstname: string

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  lastname: string
}
export default FilterUserDTO
