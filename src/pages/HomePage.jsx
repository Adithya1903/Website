import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import MOIChatbot from "../components/MOIChatbot";
import Navbar from "../components/Navbar";
import BadgePill from "../components/BadgePill";
import { useScrollReveal } from "../hooks/useScrollReveal";

const LITEPAPER_URL = "/MOILitePaper.pdf";
const NAV_H = 88;
const SPACING = 85;
const AMBIENT_HIGHLIGHT_MS = 2500;
const AMBIENT_GLOW_MS = 2000;
const PURPLE = { r: 123, g: 94, b: 167 };
const DEFAULT_COLOR = { r: 26, g: 26, b: 26 };

const LOADING_LINES = ["MOI:", "The Participant", "Layer"];
const CHAR_MS = 95;
const LINE_PAUSE_MS = 320;
const END_PAUSE_MS = 700;

const ACTIVITY_LABELS = {
  programming: "Programming",
  trading: "Trading",
  cooking: "Cooking",
  tennis: "Tennis",
  football: "Football",
  piano: "Piano",
  singing: "Singing",
  boxing: "Boxing",
  painting: "Painting",
  photography: "Photography",
  running: "Running",
  cycling: "Cycling",
  reading: "Reading",
  gaming: "Gaming",
  dancing: "Dancing",
};

const ACTIVITY_TYPES = Object.keys(ACTIVITY_LABELS);

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

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function buildParticipantPool(total) {
  const participants = [];

  while (participants.length < total) {
    for (const activity of shuffle(ACTIVITY_TYPES)) {
      participants.push({ activity, context: ACTIVITY_LABELS[activity] });
      if (participants.length >= total) return participants;
    }
  }

  return participants;
}

function buildGrid(w, h) {
  const cols = Math.ceil(w / SPACING) + 1;
  const rows = Math.ceil(h / SPACING) + 1;
  const offsetX = (w - (cols - 1) * SPACING) / 2;
  const offsetY = (h - (rows - 1) * SPACING) / 2;
  const total = cols * rows;
  const participants = buildParticipantPool(total);

  const nodes = [];
  let participantIndex = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const participant = participants[participantIndex++];
      const staggerOffset = (r % 2 === 0 ? -1 : 1) * SPACING * 0.22;
      const jitterX = rand(-SPACING * 0.16, SPACING * 0.16);
      const jitterY = rand(-SPACING * 0.2, SPACING * 0.2);
      const x = Math.max(30, Math.min(w - 30, offsetX + c * SPACING + staggerOffset + jitterX));
      const y = Math.max(28, Math.min(h - 24, offsetY + r * SPACING + jitterY));
      nodes.push({
        x,
        y,
        id: `MOI-${randomHex(4)}`,
        activity: participant.activity,
        context: participant.context,
        labelOpacity: 0,
      });
    }
  }
  return nodes;
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCircle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawEllipse(ctx, x, y, rx, ry, rotation = 0) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFigure(ctx, x, y, scale, color, alpha, activity) {
  const s = scale;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = `rgb(${color.r},${color.g},${color.b})`;
  ctx.lineWidth = 1.2 * s;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const headR = 3.1 * s;
  const headY = y - 11 * s;
  const shoulderY = y - 6 * s;
  const hipY = y + 5 * s;
  const footY = y + 14 * s;

  drawCircle(ctx, x, headY, headR);

  switch (activity) {
    case "programming":
      drawLine(ctx, x, shoulderY, x + 1 * s, hipY);
      drawLine(ctx, x, shoulderY + 2 * s, x + 6 * s, y - 1 * s);
      drawLine(ctx, x, shoulderY + 1 * s, x + 7 * s, y + 1 * s);
      drawLine(ctx, x + 1 * s, hipY, x - 4 * s, y + 9 * s);
      drawLine(ctx, x - 4 * s, y + 9 * s, x - 4 * s, footY);
      drawLine(ctx, x + 1 * s, hipY, x + 2 * s, y + 9 * s);
      drawLine(ctx, x + 2 * s, y + 9 * s, x + 7 * s, y + 9 * s);
      drawLine(ctx, x + 5 * s, y - 2 * s, x + 5 * s, y + 12 * s);
      drawLine(ctx, x + 5 * s, y - 2 * s, x + 14 * s, y - 2 * s);
      drawLine(ctx, x + 7 * s, y - 5 * s, x + 12 * s, y - 2 * s);
      drawLine(ctx, x + 12 * s, y - 2 * s, x + 7 * s, y - 2 * s);
      break;

    case "trading":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 3 * s, x + 6 * s, y - 1 * s);
      drawLine(ctx, x, y - 1 * s, x - 4 * s, y + 2 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      ctx.strokeRect(x + 7 * s, y - 8 * s, 8 * s, 10 * s);
      drawLine(ctx, x + 8.5 * s, y - 2 * s, x + 10.5 * s, y - 4.5 * s);
      drawLine(ctx, x + 10.5 * s, y - 4.5 * s, x + 12.5 * s, y - 1.5 * s);
      drawLine(ctx, x + 12.5 * s, y - 1.5 * s, x + 14 * s, y - 5 * s);
      break;

    case "cooking":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x + 5 * s, y + 1 * s);
      drawLine(ctx, x, y - 1 * s, x + 10 * s, y - 3 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      drawLine(ctx, x + 5 * s, y + 5 * s, x + 16 * s, y + 5 * s);
      ctx.strokeRect(x + 8 * s, y + 1 * s, 6 * s, 4 * s);
      drawLine(ctx, x + 14 * s, y + 2 * s, x + 17 * s, y + 2 * s);
      drawLine(ctx, x + 10 * s, y - 3 * s, x + 12.5 * s, y - 7 * s);
      break;

    case "tennis":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x - 5 * s, y + 1 * s);
      drawLine(ctx, x, y - 2 * s, x + 6 * s, y - 4 * s);
      drawLine(ctx, x, hipY, x - 6 * s, footY);
      drawLine(ctx, x, hipY, x + 3 * s, y + 10 * s);
      drawLine(ctx, x + 3 * s, y + 10 * s, x + 8 * s, footY);
      drawLine(ctx, x + 6 * s, y - 4 * s, x + 11 * s, y - 7 * s);
      drawEllipse(ctx, x + 14 * s, y - 9 * s, 3 * s, 4.5 * s, 0.4);
      drawLine(ctx, x + 11 * s, y - 7 * s, x + 12.5 * s, y - 5 * s);
      break;

    case "football":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x - 6 * s, y);
      drawLine(ctx, x, y - 2 * s, x + 5 * s, y + 1 * s);
      drawLine(ctx, x, hipY, x - 3 * s, footY);
      drawLine(ctx, x, hipY, x + 7 * s, y + 10 * s);
      drawLine(ctx, x + 7 * s, y + 10 * s, x + 11 * s, y + 12 * s);
      drawCircle(ctx, x + 13 * s, y + 12 * s, 2.2 * s);
      break;

    case "piano":
      drawLine(ctx, x, shoulderY, x + 1 * s, hipY);
      drawLine(ctx, x, y - 1 * s, x + 7 * s, y + 1 * s);
      drawLine(ctx, x, y, x + 8 * s, y + 2 * s);
      drawLine(ctx, x + 1 * s, hipY, x - 4 * s, y + 9 * s);
      drawLine(ctx, x - 4 * s, y + 9 * s, x - 4 * s, footY);
      drawLine(ctx, x + 1 * s, hipY, x + 1 * s, footY - 1 * s);
      ctx.strokeRect(x + 6 * s, y - 1 * s, 11 * s, 4 * s);
      drawLine(ctx, x + 7 * s, y + 3 * s, x + 6 * s, y + 9 * s);
      drawLine(ctx, x + 16 * s, y + 3 * s, x + 17 * s, y + 9 * s);
      break;

    case "singing":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 3 * s, x - 5 * s, y - 7 * s);
      drawLine(ctx, x, y - 2 * s, x + 5 * s, y);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      drawLine(ctx, x + 8 * s, y - 7 * s, x + 8 * s, y + 13 * s);
      drawCircle(ctx, x + 8 * s, y - 8 * s, 1.3 * s);
      break;

    case "boxing":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x - 4 * s, y - 5 * s);
      drawLine(ctx, x - 4 * s, y - 5 * s, x - 6 * s, y - 2 * s);
      drawLine(ctx, x, y - 2 * s, x + 4 * s, y - 5 * s);
      drawLine(ctx, x + 4 * s, y - 5 * s, x + 6 * s, y - 2 * s);
      drawCircle(ctx, x - 6 * s, y - 2 * s, 1.5 * s);
      drawCircle(ctx, x + 6 * s, y - 2 * s, 1.5 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      break;

    case "painting":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x + 7 * s, y - 4 * s);
      drawLine(ctx, x, y - 1 * s, x - 4 * s, y + 2 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      ctx.strokeRect(x + 8 * s, y - 8 * s, 8 * s, 10 * s);
      drawLine(ctx, x + 8 * s, y + 2 * s, x + 6 * s, y + 10 * s);
      drawLine(ctx, x + 16 * s, y + 2 * s, x + 18 * s, y + 10 * s);
      drawLine(ctx, x + 7 * s, y - 4 * s, x + 9 * s, y - 6 * s);
      break;

    case "photography":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x - 3 * s, y - 5 * s);
      drawLine(ctx, x, y - 2 * s, x + 3 * s, y - 5 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      ctx.strokeRect(x - 2.5 * s, y - 6.5 * s, 5 * s, 3.5 * s);
      drawCircle(ctx, x, y - 4.75 * s, 0.9 * s);
      break;

    case "running":
      drawLine(ctx, x - 1 * s, shoulderY, x + 2 * s, hipY);
      drawLine(ctx, x - 1 * s, y - 2 * s, x - 6 * s, y + 1 * s);
      drawLine(ctx, x, y - 2 * s, x + 6 * s, y - 5 * s);
      drawLine(ctx, x + 2 * s, hipY, x - 5 * s, y + 10 * s);
      drawLine(ctx, x - 5 * s, y + 10 * s, x - 8 * s, footY);
      drawLine(ctx, x + 2 * s, hipY, x + 7 * s, y + 7 * s);
      drawLine(ctx, x + 7 * s, y + 7 * s, x + 11 * s, y + 10 * s);
      break;

    case "cycling":
      drawCircle(ctx, x - 8 * s, y + 12 * s, 4.5 * s);
      drawCircle(ctx, x + 8 * s, y + 12 * s, 4.5 * s);
      drawLine(ctx, x - 8 * s, y + 12 * s, x - 1 * s, y + 6 * s);
      drawLine(ctx, x - 1 * s, y + 6 * s, x + 3 * s, y + 12 * s);
      drawLine(ctx, x + 3 * s, y + 12 * s, x - 8 * s, y + 12 * s);
      drawLine(ctx, x - 1 * s, y + 6 * s, x + 7 * s, y + 5 * s);
      drawLine(ctx, x + 7 * s, y + 5 * s, x + 8 * s, y + 12 * s);
      drawLine(ctx, x - 1 * s, y + 6 * s, x - 1 * s, y + 2 * s);
      drawLine(ctx, x + 1 * s, y - 2 * s, x - 1 * s, y + 2 * s);
      drawLine(ctx, x + 1 * s, y - 2 * s, x + 5 * s, y + 2 * s);
      drawLine(ctx, x + 5 * s, y + 2 * s, x + 7 * s, y + 5 * s);
      break;

    case "reading":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 2 * s, x - 4 * s, y + 1 * s);
      drawLine(ctx, x, y - 2 * s, x + 4 * s, y + 1 * s);
      drawLine(ctx, x, hipY, x - 4 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, footY);
      drawLine(ctx, x - 4 * s, y + 1 * s, x, y + 3 * s);
      drawLine(ctx, x + 4 * s, y + 1 * s, x, y + 3 * s);
      drawLine(ctx, x, y + 3 * s, x, y - 1 * s);
      break;

    case "gaming":
      drawLine(ctx, x, shoulderY, x + 1 * s, hipY);
      drawLine(ctx, x, y - 1 * s, x + 5 * s, y + 1 * s);
      drawLine(ctx, x, y, x + 6 * s, y + 2 * s);
      drawLine(ctx, x + 1 * s, hipY, x - 4 * s, y + 9 * s);
      drawLine(ctx, x - 4 * s, y + 9 * s, x - 4 * s, footY);
      drawLine(ctx, x + 1 * s, hipY, x + 2 * s, y + 9 * s);
      drawLine(ctx, x + 2 * s, y + 9 * s, x + 7 * s, y + 10 * s);
      drawLine(ctx, x + 5 * s, y + 1 * s, x + 6.5 * s, y + 2.5 * s);
      drawLine(ctx, x + 6.5 * s, y + 2.5 * s, x + 8 * s, y + 1 * s);
      drawLine(ctx, x + 8 * s, y + 1 * s, x + 9.5 * s, y + 2.5 * s);
      break;

    case "dancing":
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x, y - 3 * s, x - 6 * s, y - 7 * s);
      drawLine(ctx, x, y - 2 * s, x + 7 * s, y - 5 * s);
      drawLine(ctx, x, hipY, x - 5 * s, footY);
      drawLine(ctx, x, hipY, x + 4 * s, y + 7 * s);
      drawLine(ctx, x + 4 * s, y + 7 * s, x + 8 * s, y + 4 * s);
      break;

    default:
      drawLine(ctx, x, shoulderY, x, hipY);
      drawLine(ctx, x - 6 * s, y + 1 * s, x, y - 3 * s);
      drawLine(ctx, x, y - 3 * s, x + 6 * s, y + 1 * s);
      drawLine(ctx, x - 5 * s, y + 14 * s, x, hipY);
      drawLine(ctx, x, hipY, x + 5 * s, y + 14 * s);
  }

  ctx.restore();
}

function ParticipantCanvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);
  const activeRef = useRef(-1);
  const activeUntilRef = useRef(0);
  const ripplesRef = useRef([]);
  const rafRef = useRef(null);
  const ambientTimerRef = useRef(null);

  const rebuild = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
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
    const triggerRandomHighlight = () => {
      const nodes = nodesRef.current;
      if (nodes.length === 0) return;

      const nextIndex = Math.floor(Math.random() * nodes.length);
      const nextNode = nodes[nextIndex];

      activeRef.current = nextIndex;
      activeUntilRef.current = Date.now() + AMBIENT_GLOW_MS;
      ripplesRef.current.push({
        x: nextNode.x,
        y: nextNode.y,
        radius: 0,
        opacity: 1,
      });
    };

    const initialTimeout = window.setTimeout(triggerRandomHighlight, 1200);
    ambientTimerRef.current = window.setInterval(
      triggerRandomHighlight,
      AMBIENT_HIGHLIGHT_MS
    );

    return () => {
      window.clearTimeout(initialTimeout);
      if (ambientTimerRef.current) window.clearInterval(ambientTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;
    const dpr = window.devicePixelRatio || 1;

    const loop = () => {
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const ripples = ripplesRef.current;
      const isHighlightActive = Date.now() < activeUntilRef.current;
      if (!isHighlightActive) activeRef.current = -1;

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 8;
        ripples[i].opacity -= 0.02;
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

        let alpha = 0.10;
        let scale = 0.85;
        let color = DEFAULT_COLOR;

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

        const isActive = isHighlightActive && i === activeRef.current;
        if (isActive) {
          color = PURPLE;
          alpha = 0.7;
          scale = 1.0;
        }

        drawFigure(ctx, n.x, n.y, scale, color, alpha, n.activity);

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
          ctx.fillStyle = `rgba(255,255,255,${n.labelOpacity * 0.88})`;
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
      style={{ top: 0, left: 0, background: "transparent" }}
    />
  );
}

const FEATURES = [
  {
    title: "Context Ownership",
    description: "Participants own their digital context \u2014 preferences, assets, permissions, and trust \u2014 as a unified, portable identity.",
    icon: "\u26A1",
  },
  {
    title: "Contextual Compute",
    description: "Computation happens where context lives. No more sending your data to someone else\u2019s server to get things done.",
    icon: "\u2699\uFE0F",
  },
  {
    title: "Autonomous Agents",
    description: "Agents act on your behalf with scoped permissions, carrying your full context across any application or chain.",
    icon: "\u{1F916}",
  },
];

function FeatureCard({ feature, delay }) {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className="fade-slide-up card-surface p-8"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-3xl mb-4">{feature.icon}</div>
      <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">{feature.title}</h3>
      <p className="font-mono text-[12px] leading-relaxed text-[#1A1A1A]/40">{feature.description}</p>
    </div>
  );
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [heroOpacity, setHeroOpacity] = useState(1);
  const timersRef = useRef([]);
  const heroRef = useRef(null);

  const whatRef = useScrollReveal();
  const howRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.5));
      setHeroOpacity(fade);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-hero-gradient transition-opacity duration-[800ms] ease-out"
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
        {/* Gradient backdrop behind canvas */}
        <div className="fixed inset-0 z-[-1] bg-hero-gradient" />

        <ParticipantCanvas />
        <Navbar activePage="home" />

        {/* Hero overlay */}
        <div
          ref={heroRef}
          className="fixed left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-100"
          style={{ top: NAV_H, opacity: heroOpacity }}
        >
          <BadgePill>The Participant Layer</BadgePill>

          <h1 className="font-serif text-[clamp(3.5rem,10vw,9rem)] leading-[0.82] tracking-[-0.03em] text-center text-[#1A1A1A] mt-6">
            Context is the<br />
            New Currency
          </h1>

          <p className="font-mono text-[13px] tracking-[0.06em] mt-10 text-center">
            <span className="text-[#1A1A1A]/30">Powered by </span>
            <span className="text-[#1A1A1A]/70 font-medium">Contextual Compute</span>
          </p>

          <div className="flex gap-4 mt-8 pointer-events-auto">
            <a
              href={LITEPAPER_URL}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#7B5EA7] border border-[#1A1A1A] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-all duration-300 group"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#F5F3EE]">
                Read Litepaper
              </span>
              <span className="text-[11px] text-[#F5F3EE]/60 group-hover:translate-x-0.5 transition-transform duration-300">
                →
              </span>
            </a>
            <a
              href="https://docs.moi.technology"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/70 hover:bg-white border border-[#1A1A1A]/15 hover:border-[#1A1A1A]/30 backdrop-blur-sm shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-300 group"
            >
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/70 group-hover:text-[#1A1A1A]">
                Explore Docs
              </span>
              <span className="text-[11px] text-[#1A1A1A]/30 group-hover:translate-x-0.5 transition-transform duration-300">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Spacer for fixed hero */}
        <div style={{ height: "100vh" }} />

        {/* ── Below-fold sections ── */}
        <div className="relative z-20">

          {/* What is MOI */}
          <section className="py-28 md:py-36 px-6 md:px-8" style={{ background: "rgba(245,243,238,0.85)" }}>
            <div className="max-w-5xl mx-auto">
              <div ref={whatRef} className="fade-slide-up text-center mb-16">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7] font-medium">
                  What is MOI
                </span>
                <h2 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] text-[#1A1A1A] mt-4 max-w-2xl mx-auto">
                  A protocol where participants own their context
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                  <FeatureCard key={f.title} feature={f} delay={i * 120} />
                ))}
              </div>
            </div>
          </section>

          {/* How It Works teaser */}
          <section className="py-28 md:py-36 px-6 md:px-8" style={{ background: "rgba(245,243,238,0.85)" }}>
            <div ref={howRef} className="fade-slide-up max-w-5xl mx-auto card-surface p-0 overflow-hidden grid grid-cols-1 md:grid-cols-2">
              <div
                className="p-10 md:p-14 flex items-center justify-center min-h-[280px]"
                style={{
                  background: "linear-gradient(135deg, rgba(123,94,167,0.08) 0%, rgba(184,212,227,0.15) 100%)",
                }}
              >
                <div className="text-center">
                  <div className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-[#7B5EA7]/20">
                    WHO
                  </div>
                  <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7]/40 mt-3">
                    is missing
                  </div>
                </div>
              </div>
              <div className="p-10 md:p-14 flex flex-col justify-center">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#7B5EA7] font-medium">
                  How It Works
                </span>
                <h2 className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-[#1A1A1A] mt-4">
                  Contextual Compute in action
                </h2>
                <p className="font-mono text-[12px] leading-relaxed text-[#1A1A1A]/35 mt-4">
                  See how MOI solves delegation, context evaporation, and contract vulnerability through the participant layer.
                </p>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 mt-8 px-6 py-2.5 rounded-full bg-[#1A1A1A] hover:bg-[#7B5EA7] text-[#F5F3EE] font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300 self-start"
                >
                  See the full story
                  <span className="text-[11px] text-[#F5F3EE]/60">→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Footer CTA */}
          <section className="py-28 md:py-40 px-6 md:px-8" style={{ background: "rgba(245,243,238,0.8)" }}>
            <div ref={ctaRef} className="fade-slide-up max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-[clamp(2rem,5vw,4rem)] leading-[1.1] text-[#1A1A1A]">
                Your context. Your assets.<br />Your rules.
              </h2>
              <p className="font-mono text-[13px] leading-relaxed text-[#1A1A1A]/35 mt-6 max-w-md mx-auto">
                Read the litepaper, explore the docs, or start building with Cocolang.
              </p>
              <div className="flex gap-4 justify-center mt-10">
                <a
                  href={LITEPAPER_URL}
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-[#1A1A1A] hover:bg-[#7B5EA7] text-[#F5F3EE] font-mono text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
                >
                  Read Litepaper →
                </a>
                <a
                  href="https://docs.moi.technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-white/70 hover:bg-white border border-[#1A1A1A]/15 hover:border-[#1A1A1A]/30 backdrop-blur-sm font-mono text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/70 hover:text-[#1A1A1A] transition-all duration-300"
                >
                  Explore Docs →
                </a>
              </div>
            </div>
          </section>
        </div>

        <MOIChatbot />
      </div>
    </>
  );
}
