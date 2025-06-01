import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolio/entities/portfolio.entity';
import { Client } from './portfolio/entities/client.entity';
import { Video } from './portfolio/entities/video.entity';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Portfolio, Client, Video],
      synchronize: true,
    }),
    PortfolioModule,
  ],
})
export class AppModule {}
