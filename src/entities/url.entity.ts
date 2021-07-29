import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('urls')
export class URL {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn()
  @Column()
  owner_id: number;
}
