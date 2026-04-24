/**
 * Home route: composes the global chrome (header/footer) around the main
 * marketing + data-viz content. Kept as a server component so only
 * interactive islands opt into `"use client"`.
 */

import HomeContent from "@/app/components/HomeContent";
import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";

/** Landing page shell for the investor voting visualisation. */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <HomeContent />
      </main>
      <SiteFooter />
    </>
  );
}
