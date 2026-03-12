import "dotenv/config";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const DOCS_DIR = path.resolve("docs");
const CHUNK_SIZE = 2000;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 20;
const BATCH_DELAY = 200;

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".md" || ext === ".txt") {
    return fs.readFileSync(filePath, "utf-8");
  }
  if (ext === ".pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }
  return null;
}

function chunkText(text, source) {
  const chunks = [];

  const sections = text.split(/(?=^#{1,3}\s)/m);

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
    const text = await extractText(path.join(DOCS_DIR, file));
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
      embedding: embeddings[j],
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
