import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

import { User } from './user.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @Column('varchar', { length: 7 })
  short: string;

  @Column('varchar', { length: 2083 })
  full: string;
}
