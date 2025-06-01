import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chromium } from 'playwright';

import { Portfolio } from './entities/portfolio.entity';
import { ScraperLLMService } from './scraper-llm.service';
import { scrapeWithSelectors } from './llm-service';
import { YoutubeService } from './youtube.service';

@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepo: Repository<Portfolio>,
    private readonly llm: ScraperLLMService,
    private readonly youtubeService: YoutubeService,
  ) {}

  async scrapeAndSave(url: string, useAI: boolean = false): Promise<Portfolio> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let html = '';
    let cleanedBody = '';
    const dynamicYoutubeLinks: string[] = [];

    try {
      this.logger.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

      html = await page.content();

      const dynamicLinks = await page.$$eval(
        'a[href*="youtube.com"], iframe[src*="youtube.com"]',
        (els) =>
          els
            .map((el) => el.getAttribute('href') || el.getAttribute('src'))
            .filter((url): url is string => typeof url === 'string'),
      );

      dynamicYoutubeLinks.push(...dynamicLinks);

      const rawBody = await page.$eval('body', (el) => el.innerHTML);
      cleanedBody = rawBody
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .slice(0, 4000);

      this.logger.debug(`Cleaned Body HTML Length: ${cleanedBody.length}`);
    } catch (err) {
      this.logger.error(`Failed to load page: ${(err as Error).message}`);
      throw err;
    } finally {
      await browser.close();
    }

    const iframeYoutubeLinks = [
      ...html.matchAll(/<iframe[^>]+src=["']([^"']*youtube\.com[^"']*)["']/gi),
    ].map((m) => (m[1].startsWith('//') ? `https:${m[1]}` : m[1]));

    const textYoutubeLinks = [
      ...html.matchAll(
        /https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[^"<>\s]+/g,
      ),
    ].map((m) => m[0]);

    const allYoutubeLinks = Array.from(
      new Set([
        ...iframeYoutubeLinks,
        ...textYoutubeLinks,
        ...dynamicYoutubeLinks,
      ]),
    );

    this.logger.debug('🎯 All extracted YouTube links:', allYoutubeLinks);

    const channelVideoMap = new Map<
      string,
      { name: string; videos: { url: string }[] }
    >();

    for (const url of allYoutubeLinks) {
      const videoId = extractYoutubeVideoId(url);
      if (!videoId) continue;

      const info = await this.youtubeService.getVideoInfo(videoId);
      if (!info) continue;

      const videoEntry = {
        url: `https://www.youtube.com/watch?v=${info.videoId}`,
      };

      if (!channelVideoMap.has(info.channelTitle)) {
        channelVideoMap.set(info.channelTitle, {
          name: info.channelTitle,
          videos: [videoEntry],
        });
      } else {
        const existing = channelVideoMap.get(info.channelTitle)!;
        const alreadyAdded = existing.videos.some(
          (v) => v.url === videoEntry.url,
        );
        if (!alreadyAdded) {
          existing.videos.push(videoEntry);
        }
      }
    }

    const clients = Array.from(channelVideoMap.values());

    const selectors = useAI
      ? await this.llm.getSelectors(cleanedBody)
      : {
          name: 'h1, title',
          title: "meta[name='description']",
          bio: '.about, .bio, p',
        };

    const scraped = await scrapeWithSelectors(html, url, selectors);

    const entity = this.portfolioRepo.create({
      name: scraped.name.toLowerCase(),
      title: scraped.title.toLowerCase(),
      bio: scraped.bio.toLowerCase(),
      clients,
    });

    return this.portfolioRepo.save(entity);
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioRepo.find({
      relations: ['clients', 'clients.videos'],
    });
  }

  async findOne(id: number): Promise<Portfolio | null> {
    return this.portfolioRepo.findOne({
      where: { id },
      relations: ['clients', 'clients.videos'],
    });
  }
}

function extractYoutubeVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1] || null;
}
