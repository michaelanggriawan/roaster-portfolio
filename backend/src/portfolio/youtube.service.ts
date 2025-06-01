import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

type YoutubeSnippet = {
  title: string;
  channelTitle: string;
  channelId: string;
};

type YoutubeItem = {
  snippet: YoutubeSnippet;
};

type YoutubeApiResponse = {
  items?: YoutubeItem[];
};

@Injectable()
export class YoutubeService {
  private readonly logger = new Logger(YoutubeService.name);
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!key) {
      throw new Error(
        'YOUTUBE_API_KEY is not defined in environment variables',
      );
    }
    this.apiKey = key;
  }

  async getVideoInfo(videoId: string): Promise<{
    videoId: string;
    title: string;
    channelTitle: string;
    channelId: string;
  } | null> {
    try {
      const res = await axios.get<YoutubeApiResponse>(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet',
            id: videoId,
            key: this.apiKey,
          },
        },
      );

      const item = res.data.items?.[0];
      if (!item || !item.snippet) return null;

      const snippet = item.snippet;
      return {
        videoId,
        title: snippet.title,
        channelTitle: snippet.channelTitle,
        channelId: snippet.channelId,
      };
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Unknown error occurred';
      this.logger.error(
        `❌ Failed to fetch video info for ${videoId}: ${message}`,
      );
      return null;
    }
  }
}
