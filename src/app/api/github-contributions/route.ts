import { NextResponse } from 'next/server';

interface ContributionDay {
  date?: string;
  day?: string;
  count?: number;
  value?: number;
  level?: number;
}

export async function GET() {
  const username = 'Bharat940';
  const apis = [
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    `https://github-contributions-api.vercel.app/api/v1/${username}`,
    `https://gh-calendar.vercel.app/${username}`
  ];

  for (const url of apis) {
    try {
      console.log(`[GitHub Proxy] Attempting fetch from: ${url}`);
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (response.ok) {
        const data = await response.json();

        let formatted: { date: string, count: number, level: number }[] = [];

        if (url.includes('jogruber.de')) {
          formatted = data.contributions.map((d: { date: string, count: number, level: number }) => ({
            date: d.date,
            count: d.count,
            level: d.level
          }));
        } else if (url.includes('vercel.app')) {
          formatted = (data.contributions || data).map((d: ContributionDay) => ({
            date: d.date || d.day || '',
            count: d.count || d.value || 0,
            level: d.level || 0
          }));
        }

        console.log(`[GitHub Proxy] Success from: ${url}`);
        return NextResponse.json(formatted);
      }
    } catch (error) {
      console.error(`[GitHub Proxy] Failed fetch from ${url}:`, error);
    }
  }

  return NextResponse.json({ error: 'All GitHub APIs failed' }, { status: 502 });
}
