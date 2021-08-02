import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserCredentialsDTO {
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @MinLength(8)
  @MaxLength(20)
  @ApiProperty()
  password: string;
}
