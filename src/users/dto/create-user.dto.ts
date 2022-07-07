import { ApiProperty } from '@nestjs/swagger'

class CreateUserDto {
  @ApiProperty({ type: String, example: 'test001' })
  username: string

  @ApiProperty({ type: String, example: 'testing001' })
  password: string

  @ApiProperty({ type: String, example: 'test' })
  firstname: string

  @ApiProperty({ type: String, example: '001' })
  lastname: string

  @ApiProperty({ type: String, example: 'user' })
  role: string

  @ApiProperty({ type: Boolean, example: false })
  enabled: boolean
}
export default CreateUserDto
