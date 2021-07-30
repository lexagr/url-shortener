import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { UserCredentialsDTO } from './dto/user_credentials.dto';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private hashPassword(password: string): Promise<string> {
    const saltRounds = +this.configService.get<number>('BCRYPT_ROUNDS');

    return bcrypt.hash(password, saltRounds);
  }

  async validateCredentials(username: string, password: string) {
    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    console.log('hashed password:', hashedPassword);
    console.log(
      'password comparing result:',
      await bcrypt.compare(hashedPassword, user.password),
    );

    return user;
  }

  async registerNewUser(userCredentials: UserCredentialsDTO) {
    console.log('Request for new registration:', userCredentials);

    let user = await this.usersRepository.findOne({
      username: userCredentials.username,
    });

    if (!user) {
      user = new User();
      user.username = userCredentials.username;
      user.password = await this.hashPassword(userCredentials.password);

      user = await this.usersRepository.save(user);
    }

    if (user?.password) {
      delete user.password;
    }

    return user;
  }
}
