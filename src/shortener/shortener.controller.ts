import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Request,
  Response,
  UsePipes,
  ValidationPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShortenerService } from './shortener.service';

import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ShortLinkDTO } from '../dto/short_link.dto';
import { FullLinkDTO } from '../dto/full_link.dto';
import { Link } from '../entities/link.entity';

@Controller()
export class ShortenerController {
  constructor(
    private readonly shortenerService: ShortenerService,
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async index(@Body() link: FullLinkDTO, @Request() req) {
    return this.shortenerService.shortifyLink(req.user, link);
  }

  @Get(':link')
  @UsePipes(new ValidationPipe())
  async redirect(@Param() shortLink: ShortLinkDTO, @Response() res) {
    const fullLink = await this.shortenerService.getFullLink(shortLink);
    res.set('Location', fullLink.link).status(302).send('Found');
  }

  @Post(':link')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async update(
    @Param() shortLink: ShortLinkDTO,
    @Body() newFullLink: FullLinkDTO,
    @Request() req,
  ) {
    // console.log(req.user, shortLink, newFullLink);
    return this.shortenerService.updateLink(req.user, shortLink, newFullLink);
  }

  @Delete(':link')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  async delete(@Param() shortLink: ShortLinkDTO, @Request() req) {
    return this.shortenerService.deleteLink(req.user, shortLink);
  }
}
