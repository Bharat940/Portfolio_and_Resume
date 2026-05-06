import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  const username = "bharat940";
  const apis = [
    `https://alfa-leetcode-api.onrender.com/${username}/calendar`,
    `https://leetcode-api-faisalshohag.vercel.app/${username}`,
  ];

  for (const url of apis) {
    try {
      console.log(`[LeetCode Proxy] Attempting fetch from: ${url}`);
      const response = await fetch(url, {
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Normalize the data format
        let normalizedData = [];

        if (url.includes("alfa-leetcode-api")) {
          // Alfa API format: { submissionCalendar: { "timestamp": count } }
          // Actually Alfa might return it differently, let's check its format
          // Based on common knowledge: { submissionCalendar: string (JSON string of {ts: count}) }
          const calendar =
            typeof data.submissionCalendar === "string"
              ? JSON.parse(data.submissionCalendar)
              : data.submissionCalendar;

          normalizedData = Object.entries(calendar).map(([ts, count]) => ({
            date: new Date(parseInt(ts) * 1000).toISOString(),
            count: count,
            level: Math.min(Math.floor((count as number) / 2), 4),
          }));
        } else {
          // Faisal Shohag format: { submissionCalendar: { "timestamp": count } }
          const cal = data.submissionCalendar;
          normalizedData = Object.entries(cal).map(([ts, count]) => ({
            date: new Date(parseInt(ts) * 1000).toISOString(),
            count: count,
            level: Math.min(Math.floor((count as number) / 2), 4),
          }));
        }

        console.log(`[LeetCode Proxy] Success from: ${url}`);
        return NextResponse.json(normalizedData);
      }
    } catch (error) {
      console.error(`[LeetCode Proxy] Failed fetch from ${url}:`, error);
    }
  }

  return NextResponse.json(
    { error: "All LeetCode APIs failed" },
    { status: 502 },
  );
}
