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
  const hidden = inTransition(p) || p >= 0.94;
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
  } else if (p >= 0.47 && p < 0.52) {
    start = 0.47;
    end = 0.52;
    label = "THE SOLUTION";
    title = "Meet the participant";
  } else if (p >= 0.52 && p < 0.555) {
    start = 0.52;
    end = 0.555;
    label = "CONTEXT SUPERSTATE";
    title = "Your preferences follow you";
  } else if (p >= 0.555 && p < 0.59) {
    start = 0.555;
    end = 0.59;
    label = "CONTEXT SUPERSTATE";
    title = "Your assets live with you";
  } else if (p >= 0.59 && p < 0.625) {
    start = 0.59;
    end = 0.625;
    label = "CONTEXT SUPERSTATE";
    title = "You control who sees what";
  } else if (p >= 0.625 && p < 0.68) {
    start = 0.625;
    end = 0.68;
    label = "CONTEXT SUPERSTATE";
    title = "Every interaction makes it richer";
  } else if (p >= 0.68 && p < 0.82) {
    start = 0.68;
    end = 0.82;
    label = "PARTICIPANT LAYER";
    title = "Independent. Parallel.";
  } else if (p >= 0.82 && p < 0.94) {
    start = 0.82;
    end = 0.94;
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
