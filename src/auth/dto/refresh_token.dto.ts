import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'Refresh token' })
  token: string;
}
