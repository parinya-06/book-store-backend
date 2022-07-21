import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

class CreateUserDTO {
  @ApiProperty({
    type: String,
    example: 'test001',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 15)
  username: string

  @ApiProperty({
    type: String,
    example: 'testing001',
  })
  @IsString()
  @Length(8, 32)
  @IsNotEmpty()
  password: string

  @ApiProperty({
    type: String,
    example: 'test',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  firstname: string

  @ApiProperty({
    type: String,
    example: '001',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  lastname: string
}
export default CreateUserDTO
