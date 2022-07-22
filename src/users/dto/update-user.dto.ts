import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, Length } from 'class-validator'

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    example: 'test',
  })
  @IsOptional()
  @IsString()
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
}
