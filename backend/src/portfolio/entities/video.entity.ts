import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Client, (client) => client.videos)
  client: Client;
}
