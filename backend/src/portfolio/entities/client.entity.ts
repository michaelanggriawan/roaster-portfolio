import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Portfolio } from './portfolio.entity';
import { Video } from './video.entity';

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.clients)
  portfolio: Portfolio;

  @OneToMany(() => Video, (video) => video.client, { cascade: true })
  videos: Video[];
}
