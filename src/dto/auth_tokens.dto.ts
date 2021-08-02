import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDTO {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImxleGFnciJ9LCJpYXQiOjE2Mjc4OTIwNTIsImV4cCI6MTYyNzg5NTY1Miwic3ViIjoiMSJ9.qh6ZlIsrZBRR0SMYngn_GwsZUQq1tgyHZ55lSVQya_I',
  })
  access_token: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjI3ODkyMDUyLCJleHAiOjE2Mjc5Nzg0NTIsInN1YiI6IjEifQ.7sc5tstMYyDgxNhMDK_l-ir2s9BeZxpvQ8YjIR4OTwo',
  })
  refresh_token: string;
}
