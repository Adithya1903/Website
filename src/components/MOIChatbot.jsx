import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_CHATBOT_API || "http://localhost:3001";

const COLORS = {
  bg: "#FFFFFF",
  text: "#1A1A1A",
  muted: "rgba(26,26,26,0.4)",
  purple: "#7B5EA7",
  purpleLight: "rgba(123,94,167,0.08)",
  purpleMid: "rgba(123,94,167,0.15)",
  border: "rgba(26,26,26,0.08)",
  pageBg: "#F5F3EE",
};

const FONT = '"DM Mono", monospace';

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, padding: "8px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLORS.purple,
            opacity: 0.5,
            animation: `moiDotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function SourceTag({ source }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 10,
        fontFamily: FONT,
        padding: "2px 8px",
        borderRadius: 8,
        background: COLORS.purpleMid,
        color: COLORS.purple,
        marginRight: 4,
        marginTop: 4,
      }}
    >
      {source}
    </span>
  );
}

export default function MOIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantMsg = { role: "assistant", content: "", sources: [] };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const history = [...messages, userMsg].slice(-10);
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.type === "text") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  last.content += payload.text;
                }
                return [...updated];
              });
            } else if (payload.type === "sources") {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  last.sources = payload.sources || [];
                }
                return [...updated];
              });
            }
          } catch {
            /* skip malformed SSE lines */
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === "assistant") {
          last.content = "Sorry, something went wrong. Please try again.";
        }
        return [...updated];
      });
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes moiDotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes moiPanelIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 96,
            right: 28,
            width: 400,
            maxHeight: "70vh",
            background: COLORS.bg,
            borderRadius: 16,
            boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            fontFamily: FONT,
            animation: "moiPanelIn 0.25s ease-out",
            border: `1px solid ${COLORS.border}`,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: COLORS.purple,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: "0.06em",
                color: COLORS.text,
              }}
            >
              MOI ASSISTANT
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px 16px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  padding: "40px 16px",
                  textAlign: "center",
                  color: COLORS.muted,
                  fontSize: 13,
                  lineHeight: 1.6,
                }}
              >
                Ask me anything about MOI — the protocol, Contextual Compute,
                Krama consensus, Cocolang, and more.
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "82%",
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.55,
                      fontFamily: FONT,
                      color: msg.role === "user" ? "#FFFFFF" : COLORS.text,
                      background:
                        msg.role === "user"
                          ? COLORS.text
                          : COLORS.purpleLight,
                      borderRadius:
                        msg.role === "user"
                          ? "14px 14px 4px 14px"
                          : "14px 14px 14px 4px",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content ||
                      (msg.role === "assistant" && loading && i === messages.length - 1 ? (
                        <TypingDots />
                      ) : null)}
                  </div>
                </div>
                {msg.role === "assistant" && msg.sources?.length > 0 && (
                  <div style={{ marginTop: 4, paddingLeft: 4 }}>
                    {[
                      ...new Set(msg.sources.map((s) => s.source)),
                    ].map((src, j) => (
                      <SourceTag key={j} source={src} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              placeholder="Ask about MOI..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                fontFamily: FONT,
                color: COLORS.text,
                background: "transparent",
                padding: "8px 0",
                opacity: loading ? 0.5 : 1,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                background:
                  !loading && input.trim() ? COLORS.text : COLORS.border,
                color: "#FFFFFF",
                cursor:
                  !loading && input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.15s",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          background: COLORS.text,
          color: "#FFFFFF",
          cursor: "pointer",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.04em",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
        }}
      >
        {open ? "✕" : "MOI"}
      </button>
    </>
  );
}
