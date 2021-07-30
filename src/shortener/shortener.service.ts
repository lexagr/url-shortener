import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Link } from 'src/entities/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShortenerService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  private genRandomShortLink(): string {
    return '';
  }
}
