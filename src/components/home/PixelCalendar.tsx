"use client";

import { motion } from 'motion/react';
import { useMemo } from 'react';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface PixelCalendarProps {
  data: ContributionDay[] | null;
  colorType: 'mauve' | 'yellow' | 'green';
  label: string;
  icon: React.ReactNode;
  profileUrl?: string;
}

export function PixelCalendar({ data, colorType, label, icon, profileUrl }: PixelCalendarProps) {
  const days = useMemo(() => {
    if (!data) return Array.from({ length: 371 }).map((_, i) => ({
      date: new Date(Date.now() - (370 - i) * 24 * 60 * 60 * 1000).toISOString(),
      count: 0,
      level: 0
    }));
    return data;
  }, [data]);

  const weeks = useMemo(() => {
    const result: ContributionDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  const monthIndicators = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const indicators: { month: string, index: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, i) => {
      const firstDay = new Date(week[0].date);
      const currentMonth = firstDay.getMonth();
      if (currentMonth !== lastMonth) {
        indicators.push({ month: months[currentMonth], index: i });
        lastMonth = currentMonth;
      }
    });

    return indicators;
  }, [weeks]);

  const colorMap = {
    mauve: ['bg-muted/10', 'bg-ctp-mauve/20', 'bg-ctp-mauve/50', 'bg-ctp-mauve/80', 'bg-ctp-mauve'],
    yellow: ['bg-muted/10', 'bg-ctp-yellow/20', 'bg-ctp-yellow/50', 'bg-ctp-yellow/80', 'bg-ctp-yellow'],
    green: ['bg-muted/10', 'bg-ctp-green/20', 'bg-ctp-green/50', 'bg-ctp-green/80', 'bg-ctp-green'],
  };

  const colors = colorMap[colorType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full p-6 md:p-10 bg-card border border-border/50 rounded-[2rem] space-y-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-background/50 rounded-2xl border border-border/50 text-primary shadow-inner">
            {icon}
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-black font-heading tracking-tight">{label}</h3>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">Live Activity Tracker</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-background/30 px-4 py-3 rounded-2xl border border-border/20">
          <div className="flex flex-col">
            <span className="opacity-50">Total</span>
            <span className="text-foreground font-black text-base">{days.reduce((acc, curr) => acc + curr.count, 0)}</span>
          </div>
          <div className="w-px h-8 bg-border/50" />
          <div className="flex flex-col">
            <span className="opacity-50">Year</span>
            <span className="text-primary font-black text-base">{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      <div className="relative group/calendar">
        {/* Scrollable container — month labels live inside so they scroll with the grid */}
        <div className="w-full overflow-x-auto scrollbar-none pb-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col gap-2 min-w-max px-1"
          >
            {/* Month label row */}
            <div className="flex gap-[5px]">
              {weeks.map((week, i) => {
                const indicator = monthIndicators.find(m => m.index === i);
                return (
                  <div key={i} className="w-[12px] md:w-[15px] text-[8px] md:text-[9px] font-bold font-mono text-muted-foreground/60 uppercase overflow-visible whitespace-nowrap">
                    {indicator ? indicator.month : ''}
                  </div>
                );
              })}
            </div>

            {/* Week columns */}
            <div className="flex gap-[5px]">
              {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-[5px]">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`w-[12px] h-[12px] md:w-[15px] md:h-[15px] rounded-[3px] transition-all duration-300 hover:scale-150 hover:z-20 hover:shadow-lg cursor-crosshair border border-white/5 ${colors[Math.min(day.level, 4)]}`}
                      title={`${new Date(day.date).toDateString()}: ${day.count} items`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-between items-center mt-6 pt-6 border-t border-border/20 gap-4">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xs font-bold font-mono text-muted-foreground bg-primary/5 hover:bg-primary/10 px-5 py-2.5 rounded-xl border border-primary/20 transition-all hover:-translate-y-1"
          >
            <span className="text-primary uppercase tracking-widest">View Profile</span>
          </a>

          <div className="flex items-center gap-3 bg-background/20 p-2.5 rounded-xl border border-border/10">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">Intensity</span>
            <div className="flex gap-1.5">
              {colors.map(c => <div key={c} className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-[3px] ${c} border border-white/5`} />)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
