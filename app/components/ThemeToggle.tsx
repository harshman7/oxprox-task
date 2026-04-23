"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "ox-theme";

function apply(next: Theme) {
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

// External store subscription to the `dark` class on <html>. This lets the
// toggle stay in sync with the pre-hydration script and with system-preference
// changes without calling setState synchronously inside useEffect.
function subscribeTheme(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

// Mount flag via useSyncExternalStore — avoids the setState-in-effect warning
// while still letting us gate the icon animation until after hydration.
const noopSubscribe = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );
  const mounted = useSyncExternalStore(
    noopSubscribe,
    getMountedClient,
    getMountedServer
  );
  const reduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) return; // user preference wins
      apply(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";

    const commit = () => {
      apply(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* storage unavailable — state still applies */
      }
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => unknown;
    };
    const canViewTransition =
      !reduced &&
      typeof document !== "undefined" &&
      typeof doc.startViewTransition === "function";

    if (canViewTransition) {
      doc.startViewTransition!(commit);
    } else {
      commit();
    }
  }, [reduced]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-canvas-alt bg-surface text-ink shadow-sm outline-none transition-colors hover:bg-canvas-alt focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={reduced ? false : { rotate: -60, opacity: 0, scale: 0.6 }}
            animate={reduced ? undefined : { rotate: 0, opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { rotate: 60, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
            aria-hidden
          >
            {isDark ? <Moon size={16} /> : <Sun size={16} />}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
