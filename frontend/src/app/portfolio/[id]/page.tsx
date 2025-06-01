// File: frontend/app/portfolio/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Video {
  url: string;
}

interface Client {
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

export default function PortfolioDetailPage() {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/${id}`);
        const data = await res.json();
        setPortfolio(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="animate-spin border-4 border-white/20 border-t-white rounded-full h-12 w-12 mx-auto mb-4"></div>
          <p>Loading portfolio details...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) return <p className="text-white">Portfolio not found.</p>;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{portfolio.name}</h1>
        <h2 className="text-xl text-zinc-400 mb-4">{portfolio.title}</h2>
        <p className="mb-8 text-zinc-300 whitespace-pre-line">{portfolio.bio}</p>

        <h3 className="text-2xl font-semibold mb-4">Clients & Videos</h3>
        <div className="space-y-6">
          {portfolio.clients.map((client) => (
            <div key={client.name} className="border border-zinc-700 p-4 rounded-xl">
              <h4 className="text-lg font-bold mb-2">{client.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {client.videos.map((video, idx) => (
                  <iframe
                    key={idx}
                    src={video.url.replace('watch?v=', 'embed/')}
                    className="w-full h-52 rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
