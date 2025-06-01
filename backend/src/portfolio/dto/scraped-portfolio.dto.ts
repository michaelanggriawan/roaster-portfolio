export interface ScrapedVideo {
  url: string;
}

export interface ScrapedClient {
  name: string;
  videos: ScrapedVideo[];
}

export interface ScrapedPortfolio {
  name: string;
  title: string;
  bio: string;
  website: string;
  skills: string[];
  clients: ScrapedClient[];
}
