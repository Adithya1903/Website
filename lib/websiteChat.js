/** Shared marketing-site chat: proxy shaping + client display helpers. */

export const MARKETING_SYSTEM_OVERRIDE =
  "You are answering from the MOI marketing website, not the data room. Keep responses to 2-3 sentences maximum. No markdown links. No document references. Plain text only. Be concise and punchy — this is a landing page, not a docs site.";

const MARKETING_USER_PREFIX =
  "[CONTEXT: Marketing website chatbot. Reply in 2-3 sentences max. No markdown, no links, plain text only.]\n\n";

export function stripMarkdown(text) {
  if (typeof text !== "string" || !text) return text;
  return (
    text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^[-*]\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

/** Prefix only the last user turn (for API outbound). */
export function applyMarketingLastUserPrefix(messages) {
  if (!Array.isArray(messages) || messages.length === 0) return messages;
  return messages.map((m, i) => {
    if (i === messages.length - 1 && m.role === "user" && typeof m.content === "string") {
      return { ...m, content: MARKETING_USER_PREFIX + m.content };
    }
    return { ...m };
  });
}

/** Body forwarded from the site to the data room (used by Vercel `api/chat`). */
export function shapeProxyChatBody(body) {
  if (!body || typeof body !== "object") return body;
  const out = { ...body };
  out.system_override = MARKETING_SYSTEM_OVERRIDE;
  if (Array.isArray(body.messages) && body.messages.length > 0) {
    out.messages = applyMarketingLastUserPrefix(body.messages);
  } else if (typeof body.message === "string") {
    out.message = MARKETING_USER_PREFIX + body.message;
  }
  return out;
}
