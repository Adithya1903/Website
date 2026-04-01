/**
 * Adapters that translate the useCanvasAnimation interface
 *   (ctx, progress, time, W, H, particleState)
 * into the shape each legacy draw function expects:
 *   (ctx, state, tl, dims)
 *
 * Canvas visuals are shifted upward so text can sit at the bottom.
 * We pass cy = H * 0.4 instead of H / 2 to move drawings up.
 */

import { drawDelegationChain } from "./drawDelegationChain.js";
import { drawContextEvaporation } from "./drawContextEvaporation.js";
import { drawContractBox } from "./drawContractBox.js";
import { drawParallelLanes } from "./drawParallelLanes.js";

const VIS_CENTER = 0.35; // vertical center of the visualization area

export function adaptDelegationChain(ctx, progress, time, W, H) {
  const state = { time };
  const tl = { phase1Alpha: 1, phase1T: progress };
  const scale = 0.7;
  ctx.save();
  ctx.translate(W * (1 - scale) / 2, H * 0.1);
  ctx.scale(scale, scale);
  const cx = W / 2;
  const cy = H * 0.38;
  drawDelegationChain(ctx, state, tl, { cx, cy });
  ctx.restore();
}

export function adaptEvaporation(ctx, progress, time, W, H, particleState) {
  const state = { time };
  const tl = { phase2Alpha: 1, phase2T: progress };
  const scale = 0.72;
  ctx.save();
  ctx.translate(W * (1 - scale) / 2, H * 0.06);
  ctx.scale(scale, scale);
  const cy = H * VIS_CENTER;
  drawContextEvaporation(ctx, state, tl, { cy, W }, particleState);
  ctx.restore();
}

export function adaptContractBox(ctx, progress, time, W, H, particleState) {
  const state = { time };
  const tl = { phase3Alpha: 1, phase3T: progress };
  const scale = 0.75;
  ctx.save();
  ctx.translate(W * (1 - scale) / 2, H * 0.08);
  ctx.scale(scale, scale);
  const cx = W / 2;
  const cy = H * VIS_CENTER;
  drawContractBox(ctx, state, tl, { cx, cy, W }, particleState);
  ctx.restore();
}

export function adaptParallelLanes(ctx, progress, time, W, H) {
  const state = { time };
  const tl = { phase5Alpha: 1, phase5T: progress };
  drawParallelLanes(ctx, state, tl, { W, H });
}
