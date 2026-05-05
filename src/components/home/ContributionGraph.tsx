"use client";

import { useEffect, useState } from 'react';
import { PixelCalendar } from './PixelCalendar';
import { PixelTerminal } from '@/components/icons/PixelTerminal';
import { PixelGamepad } from '@/components/icons/PixelGamepad';
import { PixelCalendarIcon } from '@/components/icons/PixelCalendarIcon';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export function ContributionGraph() {
  const [githubData, setGithubData] = useState<ContributionDay[] | null>(null);
  const [leetcodeData, setLeetcodeData] = useState<ContributionDay[] | null>(null);

  useEffect(() => {
    function fillGaps(data: ContributionDay[]) {
      const days = 371; // 53 weeks
      const result: ContributionDay[] = [];
      const now = new Date();
      const dataMap = new Map(data.map(d => [new Date(d.date).toDateString(), d]));

      for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - (days - 1 - i));
        const dateStr = date.toDateString();
        
        if (dataMap.has(dateStr)) {
          result.push(dataMap.get(dateStr)!);
        } else {
          result.push({
            date: date.toISOString(),
            count: 0,
            level: 0
          });
        }
      }
      return result;
    }

    async function fetchGithub() {
      try {
        const response = await fetch('/api/github-contributions');
        if (response.ok) {
          const data = await response.json();
          // The proxy already returns the normalized list
          setGithubData(fillGaps(data));
        } else {
          throw new Error('GitHub proxy returned error');
        }
      } catch (error) {
        console.error('Failed to fetch github data via proxy', error);
        setGithubData(fillGaps([]));
      }
    }

    async function fetchLeetCode() {
      try {
        const response = await fetch('/api/leetcode');
        if (response.ok) {
          const data = await response.json();
          // The proxy already returns the normalized/filled data format or raw formatted list
          setLeetcodeData(fillGaps(data));
        } else {
          throw new Error('Proxy returned error');
        }
      } catch (error) {
        console.error('Failed to fetch leetcode data via proxy', error);
        setLeetcodeData(fillGaps([]));
      }
    }

    fetchGithub();
    fetchLeetCode();
  }, []);



  return (
    <section id="activity" className="w-full py-24 px-6 md:px-12 lg:px-20 space-y-20">
      <div className="max-w-7xl mx-auto">
        {/* Left Aligned Header */}
        <div className="flex flex-col items-start mb-12 space-y-4">
          <div className="flex flex-col">
            <h2 className="text-4xl md:text-8xl font-black text-foreground font-heading tracking-tighter leading-[0.85]">
              Engineering
            </h2>
            <h2 className="text-4xl md:text-8xl font-black text-ctp-yellow font-heading tracking-tighter italic flex items-center gap-3 flex-wrap">
              Vitality
              <PixelCalendarIcon className="w-9 h-9 md:w-20 md:h-20 text-ctp-yellow animate-pulse" />
            </h2>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground font-mono text-sm md:text-lg uppercase tracking-[0.2em] md:tracking-[0.3em] max-w-2xl">
              Live tracking of code commits and problem solving
            </p>
            <div className="h-1.5 w-40 bg-ctp-yellow/30 rounded-full" />
          </div>
        </div>

        <div className="flex flex-col gap-12">
          <PixelCalendar 
            data={githubData}
            colorType="mauve"
            label="GitHub Commit History"
            icon={<PixelTerminal className="w-6 h-6 text-ctp-mauve" />}
            profileUrl="https://github.com/Bharat940"
          />

          <PixelCalendar 
            data={leetcodeData}
            colorType="yellow"
            label="LeetCode Problem Solving"
            icon={<PixelGamepad className="w-6 h-6 text-ctp-yellow" />}
            profileUrl="https://leetcode.com/u/bharat940/"
          />
        </div>
      </div>
    </section>
  );
}
