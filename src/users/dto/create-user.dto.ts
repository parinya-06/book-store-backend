import { ApiProperty } from '@nestjs/swagger'

class CreateUserDto {
  @ApiProperty({ type: String, example: 'test001' })
  username: string

  @ApiProperty({ type: String, example: 'testing001' })
  password: string

  @ApiProperty({ type: String, example: 'test 001' })
  name: string

  @ApiProperty({ type: String, example: 'user' })
  role: string

  @ApiProperty({ type: String, example: 'true' })
  enabled: boolean
}
export default CreateUserDto
