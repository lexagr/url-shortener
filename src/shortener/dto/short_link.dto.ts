import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ShortLinkDTO {
  @IsNotEmpty()
  @ApiProperty()
  link: string;
}
