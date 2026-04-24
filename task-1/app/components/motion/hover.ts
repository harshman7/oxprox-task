import type { Transition } from "framer-motion";

/**
 * Shared hover / tap presets for the OxProx UI. Values are tuned on the bolder
 * side of "tasteful" — callers should still gate them behind `useReducedMotion`
 * so reduced-motion users get instant colour/opacity feedback instead.
 */

export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 22,
  mass: 0.6,
};

export const CARD_HOVER = {
  y: -8,
  scale: 1.02,
} as const;

export const CARD_TAP = {
  scale: 0.985,
} as const;

export const LIFT_HOVER = {
  y: -4,
  scale: 1.01,
} as const;

export const ICON_HOVER = {
  rotate: 6,
  scale: 1.1,
} as const;

export const BUTTON_TAP = {
  scale: 0.94,
} as const;
