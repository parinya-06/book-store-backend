import { ApiPropertyOptional } from '@nestjs/swagger'
import dayjs from 'dayjs'
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator'

export class QueryUsersDTO {
  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  page?: number

  @ApiPropertyOptional({
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  perPage?: number

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  firstname?: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  lastname?: string

  @ApiPropertyOptional({
    example: dayjs().startOf('days').toISOString(),
  })
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional({
    example: dayjs().endOf('days').toISOString(),
  })
  @IsDateString()
  @IsOptional()
  endDate?: string

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  sort?: string
}
