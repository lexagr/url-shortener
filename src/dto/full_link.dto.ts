import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FullLinkDTO {
  @IsNotEmpty()
  @ApiProperty()
  link: string;
}
