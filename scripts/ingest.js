import "dotenv/config";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const DOCS_DIR = path.resolve("docs");
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 20;
const BATCH_DELAY = 200;

async function extractTextFromPDF(filePath) {
  const doc = await getDocument(filePath).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text;
}

function chunkText(text, source) {
  const chunks = [];

  const sections = text.split(/(?=^#{1,3}\s)/m);
  // If no markdown headers found (e.g. PDF), treat whole text as one section
  if (sections.length <= 1) {
    const words = text.split(/\s+/);
    const rawChunks = [];
    for (let i = 0; i < words.length; i += Math.floor(CHUNK_SIZE / 5)) {
      const chunk = words.slice(Math.max(0, i - Math.floor(CHUNK_OVERLAP / 5)), i + Math.floor(CHUNK_SIZE / 5)).join(' ');
      if (chunk.length >= 50) {
        rawChunks.push({ content: chunk.trim(), metadata: { source } });
      }
    }
    return rawChunks;
  }
  for (const section of sections) {
    const lines = section.trim().split("\n");
    const headerMatch = lines[0]?.match(/^#{1,3}\s+(.+)/);
    const sectionTitle = headerMatch ? headerMatch[1].trim() : "";

    const body = headerMatch ? lines.slice(1).join("\n").trim() : section.trim();
    const paragraphs = body.split(/\n\n+/);

    let current = "";
    for (const para of paragraphs) {
      if (current.length + para.length > CHUNK_SIZE && current.length > 0) {
        if (current.length >= 50) {
          chunks.push({
            content: current.trim(),
            metadata: { source, section: sectionTitle },
          });
        }
        const overlap = current.slice(-CHUNK_OVERLAP);
        current = overlap + "\n\n" + para;
      } else {
        current = current ? current + "\n\n" + para : para;
      }
    }
    if (current.trim().length >= 50) {
      chunks.push({
        content: current.trim(),
        metadata: { source, section: sectionTitle },
      });
    }
  }

  return chunks;
}

async function embedBatch(texts) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });
  return res.data.map((d) => d.embedding);
}

async function main() {
  const clearFlag = process.argv.includes("--clear");

  if (clearFlag) {
    console.log("Clearing existing documents...");
    const { error } = await supabase.from("documents").delete().neq("id", 0);
    if (error) throw error;
    console.log("Cleared.");
  }

  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`docs/ folder not found at ${DOCS_DIR}. Create it and add your MOI documents.`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOCS_DIR).filter((f) => /\.(pdf|md|txt)$/i.test(f));
  if (files.length === 0) {
    console.error("No .pdf, .md, or .txt files found in docs/");
    process.exit(1);
  }

  console.log(`Found ${files.length} file(s): ${files.join(", ")}`);

  const allChunks = [];
  for (const file of files) {
    console.log(`\nProcessing: ${file}`);
    const filePath = path.join(DOCS_DIR, file);
    const ext = path.extname(file).toLowerCase();
    let text;
    if (ext === '.pdf') {
      text = await extractTextFromPDF(filePath);
    } else {
      text = fs.readFileSync(filePath, 'utf-8');
    }
    if (!text) {
      console.log(`  Skipped (unsupported format)`);
      continue;
    }
    const chunks = chunkText(text, file);
    console.log(`  → ${chunks.length} chunks`);
    allChunks.push(...chunks);
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  console.log("Generating embeddings and storing...\n");

  let stored = 0;
  for (let i = 0; i < allChunks.length; i += BATCH_SIZE) {
    const batch = allChunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map((c) => c.content);
    const embeddings = await embedBatch(texts);

    const rows = batch.map((chunk, j) => ({
      content: chunk.content,
      metadata: chunk.metadata,
      embedding: JSON.stringify(embeddings[j]),
    }));

    const { error } = await supabase.from("documents").insert(rows);
    if (error) throw error;

    stored += batch.length;
    process.stdout.write(`  Stored ${stored}/${allChunks.length} chunks\r`);

    if (i + BATCH_SIZE < allChunks.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY));
    }
  }

  console.log(`\nDone! ${stored} chunks embedded and stored in Supabase.`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
