import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

import { UserCredentialsDTO } from '../dto/user_credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { RefreshToken } from 'src/entities/refreshtoken.entity';
import { RefreshTokenDTO } from 'src/dto/refresh_token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRepository(RefreshToken)
    private readonly tokensRepository: Repository<RefreshToken>,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req): Promise<any> {
    return this.authService.generateTokensForUser(req.user);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() body: UserCredentialsDTO): any {
    return this.authService.registerNewUser(body);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  refresh(@Body() token: RefreshTokenDTO): any {
    return this.authService.refreshToken(token);
  }
}
