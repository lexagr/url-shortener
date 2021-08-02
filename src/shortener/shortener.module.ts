import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { JWTStrategy } from 'src/auth/strategies/jwt.strategy';

import { Link } from './entities/link.entity';
import { RefreshToken } from '../auth/entities/refreshtoken.entity';
import { User } from '../auth/entities/user.entity';

import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, User, RefreshToken]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ShortenerController],
  providers: [ShortenerService, JWTStrategy, AuthService],
})
export class ShortenerModule {}
