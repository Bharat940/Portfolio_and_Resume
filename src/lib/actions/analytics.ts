"use server";

import { db } from "@/lib/db";
import { analytics } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

/**
 * Tracks a specific metric by inserting it or incrementing its value on conflict.
 */
export async function trackMetric(metricName: string) {
  try {
    await db
      .insert(analytics)
      .values({
        metricName,
        value: 1,
      })
      .onConflictDoUpdate({
        target: analytics.metricName,
        set: {
          value: sql`${analytics.value} + 1`,
          updatedAt: sql`now()`,
        },
      });
  } catch (error) {
    console.error(`Failed to track metric ${metricName}:`, error);
  }
}

/**
 * Retrieves all analytics metrics from the database.
 */
export async function getAnalytics() {
  try {
    const stats = await db.select().from(analytics);
    return stats;
  } catch (error) {
    console.error("Failed to retrieve analytics:", error);
    return [];
  }
}
