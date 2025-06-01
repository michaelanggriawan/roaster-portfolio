'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Video {
  id: number;
  url: string;
}

interface Client {
  id: number;
  name: string;
  videos: Video[];
}

interface Portfolio {
  id: number;
  name: string;
  title: string;
  bio: string;
  clients: Client[];
}

export default function PortfolioListPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        setPortfolios(data);
      } catch (err) {
        console.error('Failed to fetch portfolios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  const handleClick = (id: number) => {
    router.push(`/portfolio/${id}`);
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Portfolios</h1>

        {loading ? (
          <p className="text-zinc-400">Loading portfolios...</p>
        ) : portfolios.length === 0 ? (
          <p className="text-zinc-500">No portfolios found.</p>
        ) : (
          <ul className="space-y-4">
            {portfolios.map((portfolio) => (
              <li
                key={portfolio.id}
                onClick={() => handleClick(portfolio.id)}
                className="border border-zinc-700 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition"
              >
                <div className="text-xl font-semibold">{portfolio.name} ({portfolio.title})</div>
                <p className="text-zinc-400 mt-1">{portfolio.bio}</p>
                <p className="text-zinc-500 text-sm mt-2">
                  {portfolio.clients.length} client{portfolio.clients.length !== 1 ? 's' : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
