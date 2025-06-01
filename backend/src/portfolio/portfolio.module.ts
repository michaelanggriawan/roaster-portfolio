import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Client } from './entities/client.entity';
import { Video } from './entities/video.entity';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { ScraperLLMService } from './scraper-llm.service';
import { YoutubeService } from './youtube.service';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Client, Video])],
  controllers: [PortfolioController],
  providers: [PortfolioService, ScraperLLMService, YoutubeService],
})
export class PortfolioModule {}
