import { useState, useEffect, useRef, useCallback } from "react";
import MOIChatbot from "./components/MOIChatbot";

const LITEPAPER_URL = "/MOILitePaper.pdf";
const NAV_H = 72;
const SPACING = 85;
const PURPLE = { r: 123, g: 94, b: 167 };
const DEFAULT_COLOR = { r: 26, g: 26, b: 26 };

const LOADING_LINES = ["MOI:", "The Participant", "Layer"];
const CHAR_MS = 95;
const LINE_PAUSE_MS = 320;
const END_PAUSE_MS = 700;

const TRAITS = [
  "only flies business class",
  "allergic to chicken",
  "speaks 4 languages",
  "scared of butterflies",
  "eats pizza with chopsticks",
  "has 3 cats named after planets",
  "collects vintage vinyl",
  "can solve a Rubik's cube in 40s",
  "lactose intolerant but loves cheese",
  "still uses a flip phone",
  "sleeps with socks on",
  "memorized 200 digits of pi",
  "grows bonsai trees",
  "won a yodeling contest",
  "thinks cereal is soup",
  "has a photographic memory",
  "reads books backwards",
  "types 140 wpm",
  "never eats breakfast",
  "can name every country",
  "has visited 47 countries",
  "plays chess blindfolded",
  "owns 200+ houseplants",
  "afraid of escalators",
  "makes pottery on weekends",
  "runs ultramarathons",
  "has synesthesia",
  "writes with both hands",
  "can hold breath for 3 minutes",
  "always carries a notebook",
  "knows sign language",
  "has a twin they've never met",
  "once lived on a boat for a year",
  "collects first edition books",
  "eats lemons like oranges",
  "has perfect pitch",
  "builds mechanical keyboards",
  "sleeps exactly 6 hours",
  "can juggle 5 balls",
  "drives a 1970s camper van",
  "brews their own kombucha",
  "has a fear of cotton balls",
  "reads tarot cards",
  "won a pie eating contest",
  "plays the theremin",
  "only wears black",
  "has a pet tortoise named Archimedes",
  "can recite the periodic table",
  "hiked the entire PCT",
  "makes sourdough every Sunday",
  "has a pilot's license",
  "never learned to ride a bike",
  "does cold plunges daily",
  "speaks fluent Esperanto",
  "once met the Pope",
  "collects antique maps",
  "eats sushi for breakfast",
  "can whistle in two tones",
  "has 14 siblings",
  "writes poetry in Latin",
  "trained as a ballet dancer",
  "knows morse code",
  "keeps bees on their roof",
  "can identify 300 bird species",
  "was a child actor",
  "ferments everything",
  "plays competitive Tetris",
  "has a black belt in aikido",
  "builds ships in bottles",
  "counts stairs everywhere",
  "can taste water brands apart",
  "writes letters by hand only",
  "practices lucid dreaming",
  "plays the accordion",
  "lived off-grid for 2 years",
  "has a fear of velvet",
  "solves crosswords in pen",
  "can read upside down",
  "has climbed Kilimanjaro",
  "makes candles from scratch",
  "owns a vintage typewriter",
  "refuses to use umbrellas",
  "knows every Beatles lyric",
  "does mental math faster than a calculator",
  "always sits in aisle seats",
  "collects snow globes",
  "can mimic 20 accents",
  "once broke a world record",
  "draws maps from memory",
  "allergic to Wi-Fi (claims)",
  "never takes photos",
  "wakes up at 4:30am daily",
  "has a library of 3000 books",
  "drinks coffee with salt",
  "can name every bone in the body",
  "wears mismatched socks on purpose",
  "has a lucky marble",
  "paints only in shades of blue",
  "speaks to plants every morning",
  "once swam with whale sharks",
  "prefers paper maps to GPS",
];

function randomHex(n) {
  return [...Array(n)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildGrid(w, h) {
  const cols = Math.ceil(w / SPACING) + 1;
  const rows = Math.ceil(h / SPACING) + 1;
  const offsetX = (w - (cols - 1) * SPACING) / 2;
  const offsetY = (h - (rows - 1) * SPACING) / 2;
  const total = cols * rows;

  let traits = shuffle(TRAITS);
  while (traits.length < total) traits = traits.concat(shuffle(TRAITS));

  const nodes = [];
  let ti = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      nodes.push({
        x: offsetX + c * SPACING,
        y: offsetY + r * SPACING,
        id: `MOI-${randomHex(4)}`,
        context: traits[ti++],
        labelOpacity: 0,
      });
    }
  }
  return nodes;
}

function drawFigure(ctx, x, y, scale, color, alpha) {
  const s = scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
  ctx.lineWidth = 1.2 * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const headR = 3.2 * s;
  const bodyTop = y - 8 * s;
  const bodyBot = y + 6 * s;
  ctx.beginPath();
  ctx.arc(x, bodyTop - headR, headR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, bodyTop);
  ctx.lineTo(x, bodyBot);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 6 * s, y + 1 * s);
  ctx.lineTo(x, y - 3 * s);
  ctx.lineTo(x + 6 * s, y + 1 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 5 * s, y + 14 * s);
  ctx.lineTo(x, bodyBot);
  ctx.lineTo(x + 5 * s, y + 14 * s);
  ctx.stroke();
  ctx.restore();
}

function ParticipantCanvas() {
  const canvasRef = useRef(null);
  const nodesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const activeRef = useRef(-1);
  const ripplesRef = useRef([]);
  const lastRippleTimeRef = useRef({});
  const rafRef = useRef(null);

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight - NAV_H;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    nodesRef.current = buildGrid(W, H);
  }, []);

  useEffect(() => {
    rebuild();
    window.addEventListener("resize", rebuild);
    return () => window.removeEventListener("resize", rebuild);
  }, [rebuild]);

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY - NAV_H };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const loop = () => {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nodes = nodesRef.current;
      const ripples = ripplesRef.current;

      let closestIdx = -1;
      let closestDist = Infinity;
      for (let i = 0; i < nodes.length; i++) {
        const dx = nodes[i].x - mx;
        const dy = nodes[i].y - my;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 38 && d < closestDist) {
          closestDist = d;
          closestIdx = i;
        }
      }

      if (closestIdx !== -1 && closestIdx !== activeRef.current) {
        activeRef.current = closestIdx;
        const now = Date.now();
        const lastTime = lastRippleTimeRef.current[closestIdx] || 0;
        if (now - lastTime > 600) {
          lastRippleTimeRef.current[closestIdx] = now;
          ripples.push({
            x: nodes[closestIdx].x,
            y: nodes[closestIdx].y,
            radius: 0,
            opacity: 1,
          });
        }
      }
      if (closestIdx === -1) activeRef.current = -1;

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 4;
        ripples[i].opacity -= 0.012;
        if (ripples[i].opacity <= 0) ripples.splice(i, 1);
      }

      for (const rip of ripples) {
        ctx.save();
        ctx.strokeStyle = `rgba(${PURPLE.r},${PURPLE.g},${PURPLE.b},${rip.opacity * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let alpha = 0.10;
        let scale = 0.85;
        let color = DEFAULT_COLOR;

        if (dist < 120) {
          const t = 1 - dist / 120;
          alpha = 0.10 + t * 0.18;
          scale = 0.85 + t * 0.08;
        }

        let rippleIntensity = 0;
        for (const rip of ripples) {
          const rdx = n.x - rip.x;
          const rdy = n.y - rip.y;
          const rd = Math.sqrt(rdx * rdx + rdy * rdy);
          const ringDist = Math.abs(rd - rip.radius);
          if (ringDist < 50) {
            const t = (1 - ringDist / 50) * rip.opacity;
            rippleIntensity = Math.max(rippleIntensity, t);
          }
        }

        if (rippleIntensity > 0) {
          color = {
            r: Math.round(DEFAULT_COLOR.r + (PURPLE.r - DEFAULT_COLOR.r) * rippleIntensity),
            g: Math.round(DEFAULT_COLOR.g + (PURPLE.g - DEFAULT_COLOR.g) * rippleIntensity),
            b: Math.round(DEFAULT_COLOR.b + (PURPLE.b - DEFAULT_COLOR.b) * rippleIntensity),
          };
          alpha = Math.max(alpha, 0.10 + rippleIntensity * 0.35);
          scale = Math.max(scale, 0.85 + rippleIntensity * 0.1);
        }

        const isActive = i === activeRef.current;
        if (isActive) {
          color = PURPLE;
          alpha = 0.7;
          scale = 1.0;
        }

        drawFigure(ctx, n.x, n.y, scale, color, alpha);

        if (isActive) {
          n.labelOpacity = Math.min(1, n.labelOpacity + 0.08);
        } else {
          n.labelOpacity = Math.max(0, n.labelOpacity - 0.06);
        }

        if (n.labelOpacity > 0.01) {
          const label = `${n.id} · ${n.context}`;
          ctx.save();
          ctx.globalAlpha = n.labelOpacity;
          ctx.font = "300 9px 'DM Mono', monospace";
          ctx.fillStyle = `rgba(${PURPLE.r},${PURPLE.g},${PURPLE.b},${n.labelOpacity})`;
          const metrics = ctx.measureText(label);
          const tw = metrics.width;
          const paddingX = 20;
          const rightX = n.x + 16;
          const leftX = n.x - 16;
          const fitsRight = rightX + tw + paddingX <= W;
          const drawRight = fitsRight || leftX - tw - paddingX < 0;
          const labelX = drawRight ? rightX : leftX;
          const labelY = n.y - 18 < 12 ? n.y + 24 : n.y - 18;
          ctx.textAlign = drawRight ? "left" : "right";
          ctx.textBaseline = "middle";
          const bgX = drawRight ? labelX - 4 : labelX - tw - 4;
          const bgW = tw + 8;
          const bgH = 14;
          ctx.fillStyle = `rgba(245,243,238,${n.labelOpacity * 0.88})`;
          ctx.beginPath();
          ctx.roundRect(bgX, labelY - bgH / 2, bgW, bgH, 3);
          ctx.fill();
          ctx.fillStyle = `rgba(${PURPLE.r},${PURPLE.g},${PURPLE.b},${n.labelOpacity})`;
          ctx.fillText(label, labelX, labelY);
          ctx.restore();
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed z-0"
      style={{ top: NAV_H, left: 0, background: "#F5F3EE" }}
    />
  );
}

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
      {/* Loading overlay */}
      {isLoading && (
        <div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[#F5F3EE] transition-opacity duration-[800ms] ease-out"
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
                className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-[#1A1A1A]"
              >
                {line}
              </div>
            ))}
            <div className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-[#1A1A1A]">
              {LOADING_LINES[lineIndex]?.slice(0, charIndex)}
              {!showContent && (
                <span
                  className="cursor-caret inline-block w-[0.08em] h-[0.85em] ml-[0.02em] align-middle bg-[#1A1A1A]"
                  aria-hidden
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main page */}
      <div
        className="relative min-h-screen transition-opacity duration-[800ms] ease-out"
        style={{ opacity: showContent ? 1 : 0 }}
      >
        <ParticipantCanvas />

        {/* Navigation */}
        <nav
          className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-10 lg:px-16 h-[72px]"
          style={{ background: "#F5F3EE", borderBottom: "1px solid rgba(26,26,26,0.08)" }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/logo-moi-mark.png"
              alt="MOI logo"
              className="h-12 w-12 shrink-0"
            />
            <span className="font-mono text-xs tracking-[0.35em] uppercase font-medium text-[#1A1A1A]">
              MOI
            </span>
          </div>
          <div className="flex items-center gap-10">
            <a
              href="https://docs.moi.technology"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors duration-300"
              style={{ fontWeight: 400 }}
            >
              Docs
            </a>
            <a
              href={LITEPAPER_URL}
              className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors duration-300"
              style={{ fontWeight: 400 }}
            >
              Litepaper
            </a>
          </div>
        </nav>

        {/* Hero overlay */}
        <div
          className="fixed left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center pointer-events-none"
          style={{ top: NAV_H }}
        >
          <h1 className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-center text-[#1A1A1A]">
            The Participant<br />
            Layer
          </h1>

          <p className="font-mono text-[13px] tracking-[0.06em] mt-12 text-center">
            <span className="text-[#1A1A1A]/30">Powered by </span>
            <span className="text-[#1A1A1A]/70 font-medium">Contextual Compute</span>
          </p>

          <a
            href={LITEPAPER_URL}
            className="pointer-events-auto relative inline-flex items-center gap-3 mt-8 px-10 py-3 rounded-full bg-[#F5F3EE] hover:bg-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.09)] transition-all duration-300 group"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/85 group-hover:text-[#F5F3EE] transition-colors duration-300">
              Read Litepaper
            </span>
            <span className="text-[11px] text-[#1A1A1A]/40 group-hover:text-[#F5F3EE]/70 group-hover:translate-x-0.5 transition-all duration-300">
              →
            </span>
          </a>
        </div>

        <MOIChatbot />
      </div>
    </>
  );
}
