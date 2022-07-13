import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'

class CreateUserDTO {
  @ApiProperty({ type: String, example: 'test001' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({ type: String, example: 'testing001' })
  @IsString()
  @Length(6, 32)
  @IsNotEmpty()
  password: string

  @ApiProperty({ type: String, example: 'test' })
  @IsString()
  @IsNotEmpty()
  firstname: string

  @ApiProperty({ type: String, example: '001', required: false })
  @IsOptional()
  @IsString()
  lastname: string

  @ApiProperty({ type: String, example: 'user', required: false })
  @IsOptional()
  @IsString()
  role: string

  @ApiProperty({ type: Boolean, example: false, required: false })
  @IsOptional()
  @IsBoolean()
  enabled: boolean

  @IsOptional()
  @IsString()
  refreshToken: string
}
export default CreateUserDTO
