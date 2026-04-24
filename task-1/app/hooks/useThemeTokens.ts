/**
 * Subscribes to the live OxProx palette on `:root` whenever `<html>` gains or
 * loses the `dark` class. Bridges Tailwind CSS variables to Recharts and other
 * libs that only accept inline colour strings, not `var(--token)`.
 */

"use client";

import { useSyncExternalStore } from "react";

export type ThemeTokens = {
  ink: string;
  neutral: string;
  canvasAlt: string;
  surface: string;
  isDark: boolean;
};

const DEFAULTS: ThemeTokens = {
  ink: "#0E2043",
  neutral: "#66625E",
  canvasAlt: "#E8E4E1",
  surface: "#FFFFFF",
  isDark: false,
};

/** Reads `--ox-*` from computed styles (SSR-safe: returns DEFAULTS on server). */
function read(): ThemeTokens {
  if (typeof document === "undefined") return DEFAULTS;
  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const val = (name: string, fallback: string) =>
    styles.getPropertyValue(name).trim() || fallback;
  return {
    ink: val("--ox-ink", DEFAULTS.ink),
    neutral: val("--ox-neutral", DEFAULTS.neutral),
    canvasAlt: val("--ox-canvas-alt", DEFAULTS.canvasAlt),
    surface: val("--ox-surface", DEFAULTS.surface),
    isDark: root.classList.contains("dark"),
  };
}

// Cache the last read so snapshots stay stable between renders until the class
// actually flips. useSyncExternalStore requires getSnapshot to return === when
// nothing has changed, otherwise React will warn about infinite re-renders.
let cached: ThemeTokens = DEFAULTS;
let cachedKey = "";

function getSnapshot(): ThemeTokens {
  if (typeof document === "undefined") return DEFAULTS;
  const isDark = document.documentElement.classList.contains("dark");
  const key = isDark ? "dark" : "light";
  if (key !== cachedKey) {
    cached = read();
    cachedKey = key;
  }
  return cached;
}

function getServerSnapshot(): ThemeTokens {
  return DEFAULTS;
}

function subscribe(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(() => {
    // Force a re-read next time getSnapshot runs.
    cachedKey = "";
    callback();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

/**
 * Returns the current theme tokens and re-renders when `dark` toggles on
 * `<html>`. Safe under React 18/19 strict mode and SSR (server snapshot is
 * light-theme defaults).
 */
export function useThemeTokens(): ThemeTokens {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
