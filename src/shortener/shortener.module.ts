import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from 'src/entities/link.entity';

import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  controllers: [ShortenerController],
  providers: [ShortenerService],
  // exports: [ShortenerModule],
})
export class ShortenerModule {}
