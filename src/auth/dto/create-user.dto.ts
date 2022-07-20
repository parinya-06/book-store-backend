import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

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

  @ApiPropertyOptional({
    type: String,
    example: '001',
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  lastname?: string
}
export default CreateUserDTO
