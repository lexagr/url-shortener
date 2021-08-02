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
  HttpCode,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

import { UserCredentialsDTO } from '../dto/user_credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

import { RefreshToken } from '../entities/refreshtoken.entity';
import { RefreshTokenDTO } from '../dto/refresh_token.dto';
import { AuthTokensDTO } from '../dto/auth_tokens.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    @InjectRepository(RefreshToken)
    private readonly tokensRepository: Repository<RefreshToken>,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({
    type: UserCredentialsDTO,
    description: 'User credentials',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT tokens (access, refresh)',
    type: AuthTokensDTO,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Request() req): Promise<any> {
    return this.authService.generateTokensForUser(req.user);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User created/exists' })
  @ApiResponse({ status: 400, description: 'Wrong input data' })
  register(@Body() body: UserCredentialsDTO): any {
    return this.authService.registerNewUser(body);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 400, description: 'Invalid tokens' })
  refresh(@Body() token: RefreshTokenDTO): any {
    return this.authService.refreshToken(token);
  }
}
