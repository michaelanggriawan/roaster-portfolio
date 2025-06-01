'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, ListOrdered } from 'lucide-react';

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        setMessage('Please enter a valid URL starting with http:// or https://');
        return;
      }
    } catch {
      setMessage('Invalid URL format.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, useAI }),
      });

      if (!res.ok) throw new Error('Failed to scrape');

      const data = await res.json();
      router.push(`/portfolio/${data.id}`);
    } catch (err) {
      console.error(err);
      setMessage('Error scraping URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10 flex items-center justify-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4 text-white animate-pulse">
          <Loader2 className="w-16 h-16 animate-spin text-zinc-400" />
          <p className="text-lg text-zinc-400">Scraping in progress...</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" /> Portfolio Scraper
          </h1>
          <p className="text-zinc-400">Paste a portfolio website below to extract data and videos.</p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center"
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full sm:w-96 p-3 rounded-full border border-zinc-700 bg-zinc-900 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/40"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-full px-6 py-2 font-medium disabled:opacity-50 bg-black text-white border border-zinc-500 hover:border-white cursor-pointer"
            >
              Scrape
            </button>
          </form>

          <div className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              id="use-ai"
              checked={useAI}
              onChange={() => setUseAI(!useAI)}
              className="accent-yellow-400 w-4 h-4"
            />
            <label htmlFor="use-ai" className="text-sm text-zinc-300">
              Use AI to improve scraping
            </label>
          </div>

          <div className="pt-4">
            <button
              onClick={() => router.push('/portfolio')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-500 hover:border-white bg-black text-white text-sm font-medium cursor-pointer"
            >
              <ListOrdered className="w-4 h-4" />
              View All Portfolios
            </button>
          </div>

          {message && <p className="text-lg text-red-400">{message}</p>}
        </div>
      )}
    </main>
  );
}
