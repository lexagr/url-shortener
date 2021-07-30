import {
  Controller,
  Post,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ShortenerService } from './shortener.service';

@Controller()
export class ShortenerController {
  constructor(private readonly shortenerService: ShortenerService) {}

  @Post(':link')
  @UsePipes(new ValidationPipe())
  index(@Param('link') link: string) {
    return new HttpErrorByCode[403]();
  }
}
