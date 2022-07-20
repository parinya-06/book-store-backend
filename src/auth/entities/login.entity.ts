import { ApiProperty } from '@nestjs/swagger'

export class LoginEntity {
  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6ImFkbWluIiwic3ViIjoiNjJkNGRkNmM1OWZkMTdhMGNiMmRhOTJlIiwiaWF0IjoxNjU4MjAxMDc2LCJleHAiOjE2NTgyMDE5NzZ9.dSgGlu20ZH-SibVhaOSjwkuYhY8sR3RDDF4xw5e5uiA',
  })
  accessToken: string

  @ApiProperty({
    type: String,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6ImFkbWluIiwic3ViIjoiNjJkNGRkNmM1OWZkMTdhMGNiMmRhOTJlIiwiaWF0IjoxNjU4MjAxMDc2LCJleHAiOjE2NTg4MDU4NzZ9.WUA0NujQh91qHYgrkdTJGf_ygijOkPLDw0-cmrqSLZU',
  })
  refreshToken: string
}
