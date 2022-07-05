import { ApiProperty } from '@nestjs/swagger'

class FilterUserDto {
  @ApiProperty({ type: String, required: false })
  username: string

  @ApiProperty({ type: String, required: false })
  firstname: string

  @ApiProperty({ type: String, required: false })
  lastname: string
}
export default FilterUserDto
