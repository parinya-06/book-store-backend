import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

class LoginDTO {
  @ApiProperty({ type: String, example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ type: String, example: 'admin1234' })
  @IsString()
  @IsNotEmpty()
  password: string
}
export default LoginDTO
