import { IsNotEmpty } from 'class-validator';

export class ShortLinkDTO {
  @IsNotEmpty()
  link: string;
}
