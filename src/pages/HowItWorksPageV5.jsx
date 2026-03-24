import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LITEPAPER_URL } from "../phases/constants.js";
import { computeTimelineV5 } from "../phases/v5/timingV5.js";
import { getActiveText } from "../phases/v5/textBeats.js";
import { drawDelegationChain } from "../phases/v5/drawDelegationChain.js";
import { drawContextEvaporation } from "../phases/v5/drawContextEvaporation.js";
import { drawContractBox } from "../phases/v5/drawContractBox.js";
import { drawParticipantCard } from "../phases/v5/drawParticipantCard.js";
import { drawParallelLanes } from "../phases/v5/drawParallelLanes.js";
import { drawNetwork } from "../phases/v5/drawNetwork.js";

const NAV_H = 64;

function drawTransitionText(ctx, text, alpha, size, italic, weight, W, H) {
  if (!text || alpha <= 0.01) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#1A1A1A";
  const style = italic ? "italic " : "";
  ctx.font = `${style}${weight} ${size}px "Instrument Serif", serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W * 0.5, H * 0.5);
  ctx.restore();
}

export default function HowItWorksPageV5() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const labelRef = useRef(null);
  const titleRef = useRef(null);
  const captionRef = useRef(null);
  const textLayerRef = useRef(null);
  const stateRef = useRef({ W: 0, H: 0, dpr: 1, time: 0 });
  const mapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    const state = stateRef.current;

    function resize() {
      state.dpr = window.devicePixelRatio || 1;
      state.W = window.innerWidth;
      state.H = window.innerHeight - NAV_H;
      canvas.width = state.W * state.dpr;
      canvas.height = state.H * state.dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(state.dpr, state.dpr);
      mapRef.current = null;
    }
    resize();
    window.addEventListener("resize", resize);

    function getProgress() {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return Math.max(0, Math.min(1, (-rect.top + NAV_H) / total));
    }

    let rafId;
    function draw() {
      state.time++;
      const { W, H } = state;
      ctx.clearRect(0, 0, W, H);
      const p = getProgress();
      const cx = W / 2;
      const cy = H / 2;
      const tl = computeTimelineV5(p);

      if (tl.phase1Alpha > 0.01) drawDelegationChain(ctx, state, tl, { cx, cy, W, H });
      if (tl.phase2Alpha > 0.01) drawContextEvaporation(ctx, state, tl, { cx, cy, W, H });
      if (tl.phase3Alpha > 0.01) drawContractBox(ctx, state, tl, { cx, cy, W, H });
      if (tl.phase4Alpha > 0.01) drawParticipantCard(ctx, state, tl, { cx, cy, W, H });
      if (tl.phase5Alpha > 0.01) drawParallelLanes(ctx, state, tl, { cx, cy, W, H });
      if (tl.phase6Alpha > 0.01) drawNetwork(ctx, state, tl, { cx, cy, W, H, mapRef });

      drawTransitionText(
        ctx,
        tl.transitionText,
        tl.transitionAlpha,
        tl.transitionSize,
        tl.transitionItalic,
        tl.transitionWeight,
        W,
        H
      );

      if (tl.phase7Alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = tl.phase7Alpha;
        ctx.fillStyle = "#F5F3EE";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      updateText(p);
      rafId = requestAnimationFrame(draw);
    }
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  function updateText(p) {
    const beat = getActiveText(p);
    if (!beat || !labelRef.current) return;
    const op = beat.hidden ? 0 : beat.opacity;
    labelRef.current.style.opacity = op;
    titleRef.current.style.opacity = op;
    captionRef.current.style.opacity = beat.caption ? op : 0;
    labelRef.current.textContent = beat.hidden ? "" : beat.label;
    titleRef.current.innerHTML = beat.hidden ? "" : beat.title;
    captionRef.current.textContent = beat.hidden ? "" : beat.caption;
    if (textLayerRef.current) textLayerRef.current.style.opacity = beat.hidden ? 0 : 1;
  }

  return (
    <>
      <style>{`
        .v5-scroll { position: relative; height: 3200vh; background: #F5F3EE; }
        .v5-canvas { position: sticky; top: ${NAV_H}px; width: 100%; height: calc(100vh - ${NAV_H}px); }
        .v5-text-layer {
          position: sticky; top: ${NAV_H}px; height: calc(100vh - ${NAV_H}px); width: 100%;
          margin-top: calc(-100vh + ${NAV_H}px);
          pointer-events: none; z-index: 2; display: flex; flex-direction: column;
          justify-content: flex-end; align-items: flex-start; text-align: left;
          padding: 0 48px 48px; transition: opacity 0.4s ease;
        }
        .v5-label {
          font: 500 10px/1 "DM Mono", monospace; letter-spacing: 0.15em; text-transform: uppercase;
          color: #7B5EA7; margin-bottom: 10px;
          text-shadow: 0 0 30px #F5F3EE, 0 0 60px #F5F3EE, 0 0 90px #F5F3EE;
        }
        .v5-title {
          font: normal clamp(24px, 3.5vw, 44px)/1.15 "Instrument Serif", serif;
          color: #1A1A1A; max-width: 500px;
          text-shadow: 0 0 30px #F5F3EE, 0 0 60px #F5F3EE, 0 0 90px #F5F3EE;
        }
        .v5-caption { font: 300 10px/1.5 "DM Mono", monospace; color: rgba(26,26,26,0.3); margin-top: 20px; }
        .v5-cta {
          min-height: calc(100vh - ${NAV_H}px); background: #F5F3EE;
          padding: clamp(72px, 12vh, 140px) 24px 96px; display: flex;
          align-items: center; justify-content: center; flex-direction: column; text-align: center;
        }
        .v5-cta h2 {
          font: normal clamp(36px, 5vw, 64px)/1.1 "Instrument Serif", serif;
          color: #1A1A1A; margin: 0 0 16px;
        }
        .v5-cta p {
          font: 300 13px/1.7 "DM Mono", monospace; color: rgba(26,26,26,0.35);
          margin: 0 0 32px; max-width: 460px;
        }
        .v5-cta-btn {
          border: 1px solid rgba(26,26,26,0.2); border-radius: 100px;
          padding: 14px 36px; font: 500 11px/1 "DM Mono", monospace;
          letter-spacing: 0.15em; color: #1A1A1A; background: transparent;
          cursor: pointer; transition: all 0.4s; text-decoration: none;
        }
        .v5-cta-btn:hover { background: #1A1A1A; color: #F5F3EE; }
        .v5-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 20;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(24px, 4vw, 64px); height: ${NAV_H}px;
          background: rgba(245,243,238,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(26,26,26,0.08);
        }
        .v5-nav a, .v5-nav span {
          font: 500 11px/1 "DM Mono", monospace; letter-spacing: 0.18em; text-transform: uppercase;
          text-decoration: none; transition: color 0.3s;
        }
        .v5-nav .nav-muted { color: rgba(26,26,26,0.5); }
        .v5-nav .nav-muted:hover { color: #1A1A1A; }
        .v5-nav .nav-active { color: #1A1A1A; }
        @media (max-width: 768px) { .v5-text-layer { padding: 0 24px 32px; } }
      `}</style>

      <nav className="v5-nav">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
          <img src="/logo-moi-mark.png" alt="MOI" style={{ height: 40, width: 40 }} />
          <span style={{ color: "#1A1A1A" }}>MOI</span>
        </Link>
        <div style={{ display: "flex", gap: 40 }}>
          <a href="https://docs.moi.technology" target="_blank" rel="noopener noreferrer" className="nav-muted">Docs</a>
          <span className="nav-active">How it works</span>
          <a href={LITEPAPER_URL} className="nav-muted">Litepaper</a>
        </div>
      </nav>

      <div ref={sectionRef} className="v5-scroll">
        <canvas ref={canvasRef} className="v5-canvas" />
        <div ref={textLayerRef} className="v5-text-layer">
          <div ref={labelRef} className="v5-label" />
          <div ref={titleRef} className="v5-title" />
          <div ref={captionRef} className="v5-caption" />
        </div>
      </div>
      <div className="v5-cta">
        <h2>Your context. Your assets.<br />Your rules.</h2>
        <p>Read the litepaper, explore the docs, or start building with Cocolang.</p>
        <a href={LITEPAPER_URL} className="v5-cta-btn">READ LITEPAPER →</a>
      </div>
    </>
  );
}
