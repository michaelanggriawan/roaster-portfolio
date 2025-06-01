import { load } from 'cheerio';
import {
  ScrapedPortfolio,
  ScrapedClient,
  ScrapedVideo,
} from './dto/scraped-portfolio.dto';

// Escape Tailwind or invalid pseudo-like classes
function sanitizeSelector(selector?: string): string {
  if (!selector || typeof selector !== 'string') return '';
  const trimmed = selector.trim();
  if (!trimmed || trimmed === ')' || trimmed.startsWith(')')) return '';
  return trimmed.replace(/:/g, '\\:');
}

export function scrapeWithSelectors(
  html: string,
  url: string,
  selectors: Record<string, string>,
): Promise<ScrapedPortfolio> {
  const $ = load(html);

  const getText = (selector?: string): string => {
    const safeSelector = sanitizeSelector(selector);
    if (!safeSelector) return '';
    try {
      return $(safeSelector).first().text().trim();
    } catch (err) {
      console.error(`Invalid selector "${selector}":`, err);
      return '';
    }
  };

  let videos: ScrapedVideo[] = [];
  let clients: ScrapedClient[] = [];

  try {
    const videoSelector = sanitizeSelector(selectors.videos);
    videos = videoSelector
      ? $(videoSelector)
          .map((_, el) => ({
            url: $(el).attr('src') || $(el).attr('href') || '',
          }))
          .get()
      : [];
  } catch (err) {
    console.error(`Error parsing videos selector: ${selectors.videos}`, err);
  }

  try {
    const clientSelector = sanitizeSelector(selectors.clients);
    clients = clientSelector
      ? $(clientSelector)
          .map((_, el) => ({
            name: $(el).attr('alt') || $(el).text().trim(),
            videos: [],
          }))
          .get()
      : [];
  } catch (err) {
    console.error(`Error parsing clients selector: ${selectors.clients}`, err);
  }

  // Optional: attach videos to the first client if any
  if (clients.length && videos.length) {
    clients[0].videos = videos;
  }

  return Promise.resolve({
    name: getText(selectors.name),
    title: getText(selectors.title),
    bio: getText(selectors.bio),
    website: url,
    skills: [],
    clients,
  });
}
