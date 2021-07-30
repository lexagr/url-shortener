import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserCredentialsDTO } from './dto/user_credentials.dto';
import { LocalAuth } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(LocalAuth)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() body: UserCredentialsDTO): any {
    return 'ok'; // TODO: generate jwt
    // return this.authService.validateCredentials(body.username, body.password);
  }

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() body: UserCredentialsDTO): any {
    return this.authService.registerNewUser(body);
  }
}
