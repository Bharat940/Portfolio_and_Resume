import { db } from './index';
import { knowledge } from './schema';
import { google } from '@ai-sdk/google';
import { embed } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

async function ingest() {
  console.log("Starting ingestion with Vercel AI SDK...");

  const filePath = path.join(process.cwd(), 'src/data/knowledge-base.md');
  if (!fs.existsSync(filePath)) {
    console.error("Knowledge base file not found at:", filePath);
    return;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Split by headers (##) to create meaningful chunks
  const chunks = fileContent.split(/^## /m).filter(Boolean).map(c => c.trim());

  console.log(`Found ${chunks.length} segments to ingest.`);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const header = chunk.split('\n')[0];
    console.log(`[${i + 1}/${chunks.length}] Processing: ${header}`);

    try {
      // Use Vercel AI SDK to generate embedding
      const { embedding } = await embed({
        model: google.embedding('gemini-embedding-2'),
        value: chunk,
      });

      await db.insert(knowledge).values({
        content: chunk,
        embedding: Array.from(embedding),
      });
    } catch (error) {
      console.error(`Error processing chunk ${i + 1}:`, error);
    }
  }

  console.log("✅ Ingestion successfully completed.");
}

ingest().catch((err) => {
  console.error("Fatal ingestion error:", err);
  process.exit(1);
});
