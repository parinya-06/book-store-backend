import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator'
import { ERole } from '../enums/enum-role'

class CreateUserDTO {
  @ApiProperty({
    type: String,
    example: 'test001',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(15)
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
  @Length(1, 20)
  lastname: string

  @ApiPropertyOptional({
    type: String,
    example: ERole.User,
    enum: ERole,
  })
  @IsOptional()
  @IsString()
  roles: ERole

  @ApiPropertyOptional({
    type: Boolean,
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled: boolean
}
export default CreateUserDTO
