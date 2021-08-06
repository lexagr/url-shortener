import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty()
  token: string;
}
