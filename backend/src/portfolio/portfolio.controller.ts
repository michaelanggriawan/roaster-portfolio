import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Portfolio } from './entities/portfolio.entity';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('scrape')
  async scrape(
    @Body('url') url: string,
    @Body('useAI') useAI: boolean = false, // default true
  ): Promise<Portfolio> {
    return this.portfolioService.scrapeAndSave(url, useAI);
  }

  @Get()
  async findAll(): Promise<Portfolio[]> {
    return this.portfolioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Portfolio | null> {
    return this.portfolioService.findOne(id);
  }
}
