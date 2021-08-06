import { IsNotEmpty } from 'class-validator';

export class FullLinkDTO {
  @IsNotEmpty()
  link: string;
}
