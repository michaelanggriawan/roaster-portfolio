import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ScraperLLMService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(ScraperLLMService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async getSelectors(
    html: string,
    useAI: boolean = true,
  ): Promise<Record<string, string>> {
    if (!useAI) {
      this.logger.debug('⚙️ Using default selectors (no AI)');
      return {
        name: 'h1, title',
        title: "meta[name='description']",
        bio: '.about, .bio, p',
      };
    }

    const prompt = `
You are an HTML structure analyzer. Given the following HTML snippet, return a valid JSON object that maps CSS selectors to relevant portfolio information.

The JSON keys must be:
- "name" for the person's name
- "title" for the role or profession
- "bio" for a short description

ONLY return the JSON object. Do not explain anything.

HTML:
${html}

Example:
{
  "name": "h1",
  "title": "h2",
  "bio": ".bio-section p"
}
    `.trim();

    try {
      const res = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      });

      const content = res.choices[0].message?.content ?? '{}';
      const parsed = JSON.parse(content) as Partial<
        Record<'name' | 'title' | 'bio', string>
      >;

      const isSelector = (val: unknown): val is string =>
        typeof val === 'string' && /[.#[:>]/.test(val) && val.length < 300;

      const finalSelectors: Record<string, string> = {
        name: isSelector(parsed.name) ? parsed.name : 'h1, title',
        title: isSelector(parsed.title)
          ? parsed.title
          : "meta[name='description']",
        bio: isSelector(parsed.bio) ? parsed.bio : '.about, .bio, p',
      };

      this.logger.debug('✅ Finalized LLM selectors:');
      this.logger.debug(finalSelectors);

      return finalSelectors;
    } catch (error) {
      this.logger.error('❌ Failed to fetch selectors from OpenAI', error);
      return {
        name: 'h1, title',
        title: "meta[name='description']",
        bio: '.about, .bio, p',
      };
    }
  }
}
