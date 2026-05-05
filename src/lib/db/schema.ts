import { pgTable, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core';

// We will add BetterAuth tables here later once BetterAuth is configured.

// Blog Comments Table
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  postSlug: text('post_slug').notNull(),
  content: text('content').notNull(),
  userId: text('user_id').notNull(), // Links to BetterAuth user
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// AI Knowledge Base Vector Table
export const knowledge = pgTable('knowledge', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  embedding: vector('embedding', { dimensions: 3072 }), // Gemini gemini-embedding-2 native dimension size
});
