import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserCredentialsDTO {
  @IsNotEmpty()
  username: string;

  @MinLength(8)
  @MaxLength(20)
  password: string;
}
