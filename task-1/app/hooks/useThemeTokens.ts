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
 * Reads the live OxProx theme tokens from the root element and re-reads them
 * whenever the `dark` class flips on `<html>`. Useful for third-party libraries
 * like Recharts that don't read CSS custom properties directly.
 */
export function useThemeTokens(): ThemeTokens {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
