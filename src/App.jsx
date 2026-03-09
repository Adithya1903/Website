import { useState, useEffect, useRef } from "react";

// Litepaper URL — set to your PDF or doc link
const LITEPAPER_URL = "/MOILitePaper.pdf";

// Grid only — uniform, subtle
const GRID_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='none'>",
  "<line x1='0' y1='0.25' x2='80' y2='0.25' stroke='%23d2cdc5' stroke-width='0.5'/>",
  "<line x1='0.25' y1='0' x2='0.25' y2='80' stroke='%23d2cdc5' stroke-width='0.5'/>",
  "</svg>",
].join("");

// Participant glyph only — masked to fade toward center
const GLYPH_SVG = [
  "<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='none'>",
  "<circle cx='40' cy='26' r='4.5' stroke='%2390887e' stroke-width='0.9'/>",
  "<line x1='40' y1='31' x2='40' y2='46' stroke='%2390887e' stroke-width='0.9'/>",
  "<line x1='40' y1='36' x2='33' y2='42' stroke='%2390887e' stroke-width='0.9'/>",
  "<line x1='40' y1='36' x2='47' y2='42' stroke='%2390887e' stroke-width='0.9'/>",
  "<line x1='40' y1='46' x2='34' y2='57' stroke='%2390887e' stroke-width='0.9'/>",
  "<line x1='40' y1='46' x2='46' y2='57' stroke='%2390887e' stroke-width='0.9'/>",
  "</svg>",
].join("");

// Hero exclusion: transparent center, glyphs stronger toward edges
const GLYPH_MASK =
  "radial-gradient(ellipse 72% 60% at 50% 47%, transparent 0%, transparent 36%, rgba(0,0,0,0.3) 52%, rgba(0,0,0,0.7) 74%, black 100%)";

// Grid fade: same shape but softer — grid stays more visible than glyphs near center
const GRID_MASK =
  "radial-gradient(ellipse 68% 55% at 50% 47%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.85) 74%, black 100%)";

const LOADING_LINES = ["MOI:", "The Participant", "Layer"];
const CHAR_MS = 95;
const LINE_PAUSE_MS = 320;
const END_PAUSE_MS = 700;
const FADE_MS = 550;

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const timersRef = useRef([]);

  useEffect(() => {
    if (!isLoading) return;
    const clear = () => timersRef.current.forEach((t) => clearTimeout(t));

    const currentLine = LOADING_LINES[lineIndex];
    const isLineComplete = charIndex >= currentLine.length;
    const isLastLine = lineIndex === LOADING_LINES.length - 1;

    if (isLineComplete) {
      if (isLastLine) {
        const t = setTimeout(() => {
          setShowContent(true);
          setTimeout(() => setIsLoading(false), 900);
        }, END_PAUSE_MS);
        timersRef.current.push(t);
      } else {
        const t = setTimeout(() => {
          setLineIndex((i) => i + 1);
          setCharIndex(0);
        }, LINE_PAUSE_MS);
        timersRef.current.push(t);
      }
      return clear;
    }

    const t = setTimeout(() => setCharIndex((c) => c + 1), CHAR_MS);
    timersRef.current.push(t);
    return clear;
  }, [isLoading, lineIndex, charIndex]);

  const skipAnimation = () => {
    setShowContent(true);
    setTimeout(() => setIsLoading(false), 900);
  };

  return (
    <>
      {/* Loading overlay — fades out while the page fades in underneath */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#f5f3ef] transition-opacity duration-[800ms] ease-out"
          style={{ opacity: showContent ? 0 : 1 }}
          onClick={skipAnimation}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && skipAnimation()}
          role="button"
          tabIndex={0}
          title="Click to skip"
        >
          <div className="text-center">
            {LOADING_LINES.slice(0, lineIndex).map((line, i) => (
              <div
                key={i}
              className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-[#1c1c1c]"
            >
              {line}
            </div>
          ))}
          <div className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-[#1c1c1c]">
              {LOADING_LINES[lineIndex]?.slice(0, charIndex)}
              {!showContent && (
                <span
                  className="cursor-caret inline-block w-[0.08em] h-[0.85em] ml-[0.02em] align-middle bg-[#1c1c1c]"
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main page — fades in as the loader fades out */}
      <div
        className="relative flex flex-col min-h-screen bg-[#f5f3ef] text-[#1c1c1c] overflow-hidden selection:bg-[#1c1c1c]/10 transition-opacity duration-[800ms] ease-out"
        style={{ opacity: showContent ? 1 : 0 }}
      >

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-10 lg:px-16 h-[72px]">
        <div className="flex items-center gap-3">
          <img
            src="/logo-moi-mark.png"
            alt="MOI logo"
            className="h-12 w-12 shrink-0"
          />
          <span className="font-mono text-xs tracking-[0.35em] uppercase font-medium">
            MOI
          </span>
        </div>
        <div className="flex items-center gap-10">
          <a
            href="https://docs.moi.technology"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9a9590] hover:text-[#1c1c1c] transition-colors duration-300"
            style={{ fontWeight: 700 }}
          >
            Docs
          </a>
          <a
            href={LITEPAPER_URL}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#9a9590] hover:text-[#1c1c1c] transition-colors duration-300"
            style={{ fontWeight: 700 }}
          >
            Litepaper
          </a>
        </div>
      </nav>

      {/* Structural separator */}
      <div className="relative z-10 w-full h-px bg-[#e2deda]" />

      {/* Background — below navbar only: grid uniform, glyphs fade to center */}
      <div className="absolute left-0 right-0 top-[73px] bottom-0 pointer-events-none">
        {/* Grid layer — fades toward hero center */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, rgba(210,205,197,0.7) 0px, rgba(210,205,197,0.7) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(to bottom, transparent 0px, transparent 79px, rgba(210,205,197,0.7) 79px, rgba(210,205,197,0.7) 80px)",
            backgroundSize: "80px 80px",
            WebkitMaskImage: GRID_MASK,
            maskImage: GRID_MASK,
          }}
        />
        {/* Participant glyphs — fade toward hero, exclusion zone in center */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,${GLYPH_SVG}")`,
            backgroundSize: "80px 80px",
            WebkitMaskImage: GLYPH_MASK,
            maskImage: GLYPH_MASK,
          }}
        />
      </div>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 lg:px-16">
        <div className="text-center">
          <h1 className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em]">
            MOI:<br />
            The Participant<br />
            Layer
          </h1>

          <p className="font-mono text-[13px] tracking-[0.06em] mt-12">
            <span className="text-[#7a756e]">Powered by </span>
            <span className="text-[#2e2a2f] font-medium">Contextual Compute</span>
          </p>

          <a
            href={LITEPAPER_URL}
            className="relative z-20 inline-flex items-center gap-3 mt-8 px-10 py-3 rounded-full bg-[#f5f3ef] hover:bg-[#1c1c1c] border border-[#1c1c1c]/30 hover:border-[#1c1c1c] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.09)] transition-all duration-300 group"
          >
            <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[#1c1c1c]/85 group-hover:text-[#f5f3ef] transition-colors duration-300">
              Read Litepaper
            </span>
            <span className="text-[11px] text-[#1c1c1c]/40 group-hover:text-[#f5f3ef]/70 group-hover:translate-x-0.5 transition-all duration-300">
              →
            </span>
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-10 lg:px-16 py-5">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#c0bab2]">
          © 2026 MOI
        </span>
      </footer>
    </div>
    </>
  );
}
