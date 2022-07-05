import { ApiProperty } from '@nestjs/swagger'

class LoginDto {
  @ApiProperty({ type: String, example: 'admin' })
  username: string

  @ApiProperty({ type: String, example: 'admin1234' })
  password: string
}
export default LoginDto
