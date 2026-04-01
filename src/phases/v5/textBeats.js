function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function ramp(v, a, b) {
  if (v <= a) return 0;
  if (v >= b) return 1;
  return (v - a) / (b - a);
}

const TRANSITIONS = [
  [0.14, 0.16],
  [0.30, 0.32],
  [0.42, 0.45],
  [0.45, 0.47],
];

function inTransition(p) {
  return TRANSITIONS.some(([a, b]) => p >= a && p < b);
}

export function getActiveText(p) {
  const hidden = inTransition(p) || p >= 0.97;
  let label = "";
  let title = "";
  let start = 0;
  let end = 1;

  if (p < 0.14) {
    start = 0.00;
    end = 0.14;
    label = "THE PROBLEM";
    title = "When agents delegate,<br>trust breaks down";
  } else if (p >= 0.16 && p < 0.30) {
    start = 0.16;
    end = 0.30;
    label = "THE PROBLEM";
    title = "Every agent starts<br>from zero";
  } else if (p >= 0.32 && p < 0.42) {
    start = 0.32;
    end = 0.42;
    label = "THE PROBLEM";
    title = "Your tokens live in<br>someone else's contract";
  } else if (p >= 0.47 && p < 0.54) {
    start = 0.47;
    end = 0.54;
    label = "THE SOLUTION";
    title = "Delegation is scoped and signed";
  } else if (p >= 0.54 && p < 0.61) {
    start = 0.54;
    end = 0.61;
    label = "CONTEXT SUPERSTATE";
    title = "Your preferences follow you";
  } else if (p >= 0.61 && p < 0.68) {
    start = 0.61;
    end = 0.68;
    label = "CONTEXT SUPERSTATE";
    title = "Your assets live with you";
  } else if (p >= 0.68 && p < 0.75) {
    start = 0.68;
    end = 0.75;
    label = "CONTEXT SUPERSTATE";
    title = "You control who sees what";
  } else if (p >= 0.75 && p < 0.82) {
    start = 0.75;
    end = 0.82;
    label = "CONTEXT SUPERSTATE";
    title = "Trust is earned, not assumed";
  } else if (p >= 0.82 && p < 0.88) {
    start = 0.82;
    end = 0.88;
    label = "CONTEXT SUPERSTATE";
    title = "Every interaction makes it richer";
  } else if (p >= 0.88 && p < 0.93) {
    start = 0.88;
    end = 0.93;
    label = "PARTICIPANT LAYER";
    title = "Independent. Parallel.";
  } else if (p >= 0.93 && p < 0.97) {
    start = 0.93;
    end = 0.97;
    label = "THE PARTICIPANT LAYER";
    title = "Independent. Parallel.<br>Participant-centric.";
  }

  const fadeIn = smoothstep(ramp(p, start, start + 0.015));
  const fadeOut = 1 - smoothstep(ramp(p, end - 0.015, end));

  return {
    label,
    title,
    caption: "",
    opacity: hidden ? 0 : Math.min(fadeIn, fadeOut),
    fadeIn,
    hidden,
  };
}
