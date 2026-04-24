/**
 * Shared Framer Motion transition and gesture presets for the OxProx UI.
 * Imported by cards, buttons, and the theme toggle so hover/tap feel consistent.
 * Callers should still gate motion props with `useReducedMotion` so users who
 * prefer reduced motion get instant feedback instead of springs.
 */

import type { Transition } from "framer-motion";

/**
 * Default spring for hover lifts and small rotations. Stiff enough to feel
 * snappy without overshooting on touch devices.
 */
export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
  mass: 0.6,
};

/** Hover target for large insight / resolution cards (lift + slight scale). */
export const CARD_HOVER = {
  y: -8,
  scale: 1.02,
} as const;

/** Tap feedback paired with CARD_HOVER so pressed cards feel slightly recessed. */
export const CARD_TAP = {
  scale: 0.985,
} as const;

/** Subtler lift for medium-weight surfaces (reading guide tiles, chart shell). */
export const LIFT_HOVER = {
  y: -4,
  scale: 1.01,
} as const;

/** Small decorative icons (badges, inline glyphs) that can rotate on hover. */
export const ICON_HOVER = {
  rotate: 6,
  scale: 1.1,
} as const;

/** Primary buttons and icon-only controls: stronger squash on tap than cards. */
export const BUTTON_TAP = {
  scale: 0.94,
} as const;
