import { ramp, smoothstep } from "../timing.js";

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function envelope(p, start, end, fade = 0.012) {
  const fadeInEnd = start + fade;
  const fadeOutStart = end - fade;
  return smoothstep(ramp(p, start, fadeInEnd)) * (1 - smoothstep(ramp(p, fadeOutStart, end)));
}

function transitionAlpha(p, start, end) {
  const t = ramp(p, start, end);
  return Math.sin(t * Math.PI);
}

function snapPhase4(t) {
  const S = 0.03, E = 0.93, N = 6;
  if (t <= S || t >= E) return t;
  const slotW = (E - S) / N;
  const i = Math.min(N - 1, Math.floor((t - S) / slotW));
  const base = S + i * slotW;
  const f = (t - base) / slotW;
  let r;
  if (f < 0.08)      r = (f / 0.08) * 0.28;
  else if (f < 0.92) r = 0.28 + ((f - 0.08) / 0.84) * 0.57;
  else                r = 0.85 + ((f - 0.92) / 0.08) * 0.15;
  return base + r * slotW;
}

export function computeTimelineV5(p) {
  const phase1Start = 0.00, phase1End = 0.14;
  const trans1Start = 0.14, trans1End = 0.16;
  const phase2Start = 0.16, phase2End = 0.30;
  const trans2Start = 0.30, trans2End = 0.32;
  const phase3Start = 0.32, phase3End = 0.42;
  const trans3Start = 0.42, trans3End = 0.45;
  const whoStart = 0.45, whoEnd = 0.47;
  const phase4Start = 0.47, phase4End = 0.88;
    const phase5Start = 0.88, phase5End = 0.93;
    const phase6Start = 0.93, phase6End = 0.97;
    const phase7Start = 0.97, phase7End = 1.00;

  const phase1Alpha = envelope(p, phase1Start, phase1End);
  const phase2Alpha = envelope(p, phase2Start, phase2End);
  const phase3Alpha = envelope(p, phase3Start, phase3End);
  const phase4Alpha = envelope(p, phase4Start, phase4End);
  const phase5Alpha = envelope(p, phase5Start, phase5End);
  const phase6Alpha = envelope(p, phase6Start, phase6End);
  const phase7Alpha = smoothstep(ramp(p, phase7Start, phase7End));

  const phase1T = smoothstep(easeOutCubic(ramp(p, phase1Start, phase1End)));
  const phase2T = smoothstep(ramp(p, phase2Start, phase2End));
  const phase3T = smoothstep(ramp(p, phase3Start, phase3End));
  const phase4T = snapPhase4(smoothstep(ramp(p, phase4Start, phase4End)));
  const phase5T = smoothstep(ramp(p, phase5Start, phase5End));
  const phase6T = smoothstep(ramp(p, phase6Start, phase6End));

  let transitionText = "";
  let transitionAlphaValue = 0;
  let transitionSize = 36;
  let transitionItalic = true;
  let transitionWeight = "normal";

  if (p >= trans1Start && p < trans1End) {
    transitionText = "But that's not the only problem.";
    transitionAlphaValue = transitionAlpha(p, trans1Start, trans1End);
  } else if (p >= trans2Start && p < trans2End) {
    transitionText = "And there's one more.";
    transitionAlphaValue = transitionAlpha(p, trans2Start, trans2End);
  } else if (p >= trans3Start && p < trans3End) {
    transitionText = "Three problems. One root cause.";
    transitionAlphaValue = transitionAlpha(p, trans3Start, trans3End);
  } else if (p >= whoStart && p < whoEnd) {
    transitionText = "WHO is missing.";
    transitionAlphaValue = transitionAlpha(p, whoStart, whoEnd);
    transitionSize = 56;
    transitionItalic = false;
    transitionWeight = "700";
  }

  return {
    p,
    phase1Alpha,
    phase1T,
    phase2Alpha,
    phase2T,
    phase3Alpha,
    phase3T,
    phase4Alpha,
    phase4T,
    phase5Alpha,
    phase5T,
    phase6Alpha,
    phase6T,
    phase7Alpha,
    transitionText,
    transitionAlpha: transitionAlphaValue,
    transitionSize,
    transitionItalic,
    transitionWeight,
  };
}
