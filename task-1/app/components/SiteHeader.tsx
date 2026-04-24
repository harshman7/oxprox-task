/**
 * Top site chrome: OxProx wordmark (swaps dark/light asset with theme),
 * kicker line, and the theme toggle. Server component — ThemeToggle is the
 * only client island.
 */

import Image from "next/image";
import Link from "next/link";

import ThemeToggle from "@/app/components/ThemeToggle";

/** Sticky-leaning header bar for every page. */
export default function SiteHeader() {
  return (
    <header className="border-b border-canvas-alt bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 sm:py-6">
        <Link
          href="/"
          aria-label="OxProx home"
          className="group inline-flex items-center rounded-sm outline-none transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {/* Dark wordmark for light theme — `dark:hidden` avoids CSS invert hacks */}
          <Image
            src="/brand/oxprox-logo.svg"
            alt="OxProx"
            width={232}
            height={40}
            priority
            className="h-9 w-auto transition-transform duration-200 group-hover:scale-[1.03] sm:h-10 dark:hidden"
          />
          {/* White wordmark for dark theme */}
          <Image
            src="/brand/oxprox-logo-white.svg"
            alt="OxProx"
            width={232}
            height={40}
            priority
            className="hidden h-9 w-auto transition-transform duration-200 group-hover:scale-[1.03] sm:h-10 dark:block"
          />
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-neutral transition-colors duration-200 hover:text-blue-500 sm:inline-block">
            Proxy voting intelligence
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
