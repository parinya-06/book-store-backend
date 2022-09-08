import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class UpdatePasswordUserDto {
  @ApiProperty({
    type: String,
    example: 'testing001',
  })
  @IsString()
  @Length(8, 32)
  @IsNotEmpty()
  oldPassword: string

  @ApiProperty({
    type: String,
    example: 'testing001',
  })
  @IsString()
  @Length(8, 32)
  @IsNotEmpty()
  password: string
}
