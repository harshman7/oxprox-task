/**
 * Root layout: loads OxProx brand fonts, global CSS tokens, and a blocking
 * inline script so the correct light/dark theme applies before first paint
 * (avoids a flash of the wrong background). Children are the App Router pages.
 */

import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OxProx - Investor Voting",
  description:
    "How institutional investors voted across five shareholder resolutions.",
};

/**
 * Runs synchronously in <head> before React hydrates. Reads `localStorage`
 * (`ox-theme`) or falls back to `prefers-color-scheme`, then toggles the
 * `dark` class on `<html>` so Tailwind's `@custom-variant dark` matches paint.
 */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('ox-theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var useDark = stored ? stored === 'dark' : systemDark;
    if (useDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Script above mutates className before hydration; this suppresses the
      // server/client mismatch warning on <html>.
      suppressHydrationWarning
      className={`${dmSerifDisplay.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-canvas text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
