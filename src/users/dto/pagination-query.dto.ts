import { IsOptional, IsPositive } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class PaginationQueryDTO {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsPositive()
  limit: number

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsPositive()
  offset: number
}
