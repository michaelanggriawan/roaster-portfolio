import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Client } from './client.entity';

@Entity()
export class Portfolio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  website: string;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @OneToMany(() => Client, (client) => client.portfolio, { cascade: true })
  clients: Client[];
}
