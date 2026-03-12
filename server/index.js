import "dotenv/config";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const SYSTEM_PROMPT = `You are MOI Assistant, an expert on the MOI protocol — the world's first context-aware blockchain and participant layer powered by Contextual Compute.

You answer questions using ONLY the provided context from MOI's official documents (litepaper, whitepaper, docs, blog posts). If the context doesn't contain enough information to answer a question, say so honestly rather than making things up.

Guidelines:
- Be concise and clear. Avoid unnecessary jargon unless the user asks for technical depth.
- When referencing specific concepts (ICSM, Krama, Cocolang, Context-Power, etc.), explain them briefly.
- If asked about something outside MOI, politely redirect.
- Use a warm, knowledgeable tone — like a senior MOI team member explaining things.
- Format responses with markdown when helpful.`;

async function embedQuery(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

async function findRelevantChunks(embedding) {
  const { data, error } = await supabase.rpc("match_documents", {
    query_embedding: embedding,
    match_threshold: 0.5,
    match_count: 6,
  });
  if (error) throw error;
  return data || [];
}

function buildContext(chunks) {
  return chunks
    .map((chunk, i) => {
      const source = chunk.metadata?.source || "unknown";
      const section = chunk.metadata?.section || "";
      const header = section ? `${source} — ${section}` : source;
      return `[Source ${i + 1}: ${header}]\n${chunk.content}`;
    })
    .join("\n\n---\n\n");
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    const embedding = await embedQuery(message);
    const chunks = await findRelevantChunks(embedding);
    const context = buildContext(chunks);

    const recentHistory = history.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const userContent = `<context>\n${context}\n</context>\n\nUser question: ${message}`;
    const messages = [...recentHistory, { role: "user", content: userContent }];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages,
    });

    stream.on("text", (text) => {
      res.write(`data: ${JSON.stringify({ type: "text", text })}\n\n`);
    });

    stream.on("end", () => {
      const sources = chunks.map((c) => ({
        source: c.metadata?.source || "unknown",
        section: c.metadata?.section || "",
        similarity: c.similarity,
      }));
      res.write(`data: ${JSON.stringify({ type: "sources", sources })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
      res.end();
    });
  } catch (err) {
    console.error("Chat error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`MOI chatbot server running on :${PORT}`));
