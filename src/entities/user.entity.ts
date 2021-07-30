import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Link } from './link.entity';

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
}
