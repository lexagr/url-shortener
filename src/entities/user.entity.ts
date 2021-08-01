import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from './link.entity';
import { RefreshToken } from './refreshtoken.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Link, (link) => link.owner)
  links: Link[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.owner)
  refreshTokens: RefreshToken[];
}
