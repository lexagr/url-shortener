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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShortenerService } from './shortener.service';

import { JWTAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ShortLinkDTO } from './dto/short_link.dto';
import { FullLinkDTO } from './dto/full_link.dto';
import { Link } from './entities/link.entity';
import { ShortenedLinkDTO } from './dto/shortened_link.dto';

@Controller()
@ApiTags('shortener_service')
export class ShortenerController {
  constructor(
    private readonly shortenerService: ShortenerService,
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  @Post()
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Short any link' })
  @ApiResponse({
    status: 201,
    description: 'Link successfully created',
    type: ShortenedLinkDTO,
  })
  @ApiResponse({
    status: 401,
    description: 'User unauthorized',
  })
  async index(@Body() link: FullLinkDTO, @Request() req) {
    return this.shortenerService.shortifyLink(req.user, link);
  }

  @Get(':link')
  @ApiOperation({ summary: 'Get location header for shortlink' })
  @ApiResponse({ status: 302, description: 'Found' })
  @ApiResponse({ status: 400, description: "Link doesn't exists" })
  async redirect(@Param() shortLink: ShortLinkDTO, @Response() res) {
    const fullLink = await this.shortenerService.getFullLink(shortLink);
    res.set('Location', fullLink.link).status(302).send('Found');
  }

  @Post(':link')
  @UseGuards(JWTAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update link' })
  @ApiResponse({ status: 200, description: 'Link successfully updated' })
  @ApiResponse({ status: 400, description: "Link doesn't exists" })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: "User doesn't have rights" })
  async update(
    @Param() shortLink: ShortLinkDTO,
    @Body() newFullLink: FullLinkDTO,
    @Request() req,
  ) {
    return this.shortenerService.updateLink(req.user, shortLink, newFullLink);
  }

  @Delete(':link')
  @UseGuards(JWTAuthGuard)
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete link' })
  @ApiResponse({ status: 200, description: 'Link successfully deleted' })
  @ApiResponse({ status: 400, description: "Link doesn't exists" })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: "User doesn't have rights" })
  async delete(@Param() shortLink: ShortLinkDTO, @Request() req) {
    return this.shortenerService.deleteLink(req.user, shortLink);
  }
}
