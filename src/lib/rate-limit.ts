const trackers = new Map<string, { count: number; lastReset: number }>();

const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export async function rateLimit(ip: string) {
  const now = Date.now();
  const tracker = trackers.get(ip) || { count: 0, lastReset: now };

  if (now - tracker.lastReset > WINDOW_SIZE) {
    tracker.count = 0;
    tracker.lastReset = now;
  }

  tracker.count++;
  trackers.set(ip, tracker);

  return {
    success: tracker.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - tracker.count),
    reset: tracker.lastReset + WINDOW_SIZE,
  };
}
