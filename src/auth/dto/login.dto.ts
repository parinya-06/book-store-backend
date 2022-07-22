import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

class LoginDTO {
  @ApiProperty({
    type: String,
    example: 'admin1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 15)
  username: string

  @ApiProperty({
    type: String,
    example: 'admin1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password: string
}
export default LoginDTO
