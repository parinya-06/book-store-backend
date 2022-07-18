import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

class LoginDTO {
  @ApiProperty({
    type: String,
    example: 'admin1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
  username: string

  @ApiProperty({
    type: String,
    example: 'admin1234',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string
}
export default LoginDTO
