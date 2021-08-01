import { HttpCode, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as uuid from 'uuid';
import { createHash } from 'crypto';

import { Link } from '../entities/link.entity';
import { User } from '../entities/user.entity';

import { FullLinkDTO } from '../dto/full_link.dto';
import { ShortLinkDTO } from '../dto/short_link.dto';
import { ShortenedLinkDTO } from '../dto/shortened_link.dto';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Injectable()
export class ShortenerService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  private genLinkUUID(): string {
    const v4 = uuid.v4();
    const v4_sha256 = createHash('sha256');
    const hash = v4_sha256.update(v4);

    return hash.digest('hex').substr(0, 7);
  }

  async shortifyLink(
    user: User,
    fullLink: FullLinkDTO,
  ): Promise<ShortenedLinkDTO> {
    let link = await this.linksRepository.findOne({
      where: { full: fullLink.link },
    });

    if (!link) {
      link = new Link();
      link.owner = user;
      link.short = this.genLinkUUID();
      link.full = fullLink.link;

      link = await this.linksRepository.save(link);
      console.log('saved link:', link);
    }

    const dto = new ShortenedLinkDTO();
    dto.short = link.short;
    dto.full = link.full;

    return dto;
  }

  async getFullLink(shortLink: ShortLinkDTO): Promise<FullLinkDTO> {
    const fullLink = await this.linksRepository.findOne({
      where: { short: shortLink.link },
    });

    if (!fullLink) {
      throw new HttpErrorByCode[400]();
    }

    const fullLinkDTO = new FullLinkDTO();
    fullLinkDTO.link = fullLink.full;

    return fullLinkDTO;
  }

  async updateLink(
    user: User,
    shortLink: ShortLinkDTO,
    newFullLink: FullLinkDTO,
  ) {
    const link = await this.linksRepository.findOne({
      where: { short: shortLink.link },
      relations: ['owner'],
    });

    // link is not exists
    if (!link) {
      throw new HttpErrorByCode[400]();
    }

    // user doesn't have access rights for this link
    if (link.owner.id != user.id) {
      throw new HttpErrorByCode[403]();
    }

    link.full = newFullLink.link;
    this.linksRepository.save(link);
  }

  async deleteLink(user: User, shortLink: ShortLinkDTO) {
    const link = await this.linksRepository.findOne({
      where: { short: shortLink.link },
      relations: ['owner'],
    });

    // link is not exists
    if (!link) {
      throw new HttpErrorByCode[400]();
    }

    // user doesn't have access rights for this link
    if (link.owner.id != user.id) {
      throw new HttpErrorByCode[403]();
    }

    this.linksRepository.delete(link);
  }
}
