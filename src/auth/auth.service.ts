import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import * as bcrypt from 'bcrypt';

import { UserCredentialsDTO } from '../dto/user_credentials.dto';
import { User } from '../entities/user.entity';
import { RefreshToken } from 'src/entities/refreshtoken.entity';
import { RefreshTokenDTO } from 'src/dto/refresh_token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly tokensRepository: Repository<RefreshToken>,
  ) {}

  private hashPassword(password: string): Promise<string> {
    const saltRounds = +this.configService.get<number>('BCRYPT_ROUNDS');

    return bcrypt.hash(password, saltRounds);
  }

  filterUserForPublic(user: User) {
    delete user.password;
    return user;
  }

  async generateTokensForUser(user: User): Promise<any> {
    user = this.filterUserForPublic(user);

    let refreshToken = new RefreshToken();
    refreshToken.owner = user;
    refreshToken = await this.tokensRepository.save(refreshToken);

    return {
      access_token: this.jwtService.sign(
        { user: user },
        { expiresIn: '1h', subject: user.id.toString() },
      ),
      refresh_token: this.jwtService.sign(
        { id: refreshToken.id },
        { expiresIn: '1d', subject: user.id.toString() },
      ),
    };
  }

  async validateCredentials(username: string, password: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return this.filterUserForPublic(user);
    }

    return null;
  }

  async registerNewUser(userCredentials: UserCredentialsDTO) {
    let user = await this.usersRepository.findOne({
      username: userCredentials.username,
    });

    if (!user) {
      user = new User();
      user.username = userCredentials.username;
      user.password = await this.hashPassword(userCredentials.password);

      user = await this.usersRepository.save(user);
    }

    const { id, username } = user;

    return { id, username };
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO) {
    try {
      const inputToken = this.jwtService.verify(refreshTokenDTO.token);

      const refreshTokenInput = new RefreshToken();
      refreshTokenInput.id = inputToken.id;

      const deleteResult = await this.tokensRepository.delete(
        refreshTokenInput,
      );

      // token was in db?
      if (deleteResult?.affected <= 0) {
        throw new HttpErrorByCode[400]();
      }

      // user is valid?
      const user = await this.usersRepository.findOne({ id: +inputToken.sub });
      if (!user) {
        throw new HttpErrorByCode[400]();
      }

      // return new valid tokens
      return await this.generateTokensForUser(user);
    } catch (e) {
      throw new HttpErrorByCode[400]();
    }
  }
}
