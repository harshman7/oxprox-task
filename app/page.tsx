import SiteFooter from "@/app/components/SiteFooter";
import SiteHeader from "@/app/components/SiteHeader";
import VotesChart from "@/app/components/VotesChart";
import { RESOLUTIONS } from "@/app/data/votes";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14">
          <section className="mb-8 sm:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-500">
              Shareholder voting
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">
              How investors voted across five resolutions
            </h1>
            <p className="mt-4 max-w-2xl text-base text-neutral sm:text-lg">
              A snapshot of five fictional institutional investors and their
              votes on five proposals at a company shareholder meeting. Hover
              any bar to see the exact vote counts, percentages, and the
              resolutions behind them.
            </p>
          </section>

          <section className="rounded-2xl border border-canvas-alt bg-surface p-4 shadow-sm sm:p-8">
            <VotesChart />
          </section>

          <section className="mt-8 rounded-2xl border border-canvas-alt bg-surface/60 p-6 sm:mt-10 sm:p-8">
            <h2 className="font-display text-xl text-ink sm:text-2xl">
              The five resolutions
            </h2>
            <ol className="mt-4 grid gap-3 text-sm text-ink/90 sm:grid-cols-2 sm:text-base">
              {RESOLUTIONS.map((r) => (
                <li
                  key={r.id}
                  className="flex items-start gap-3 rounded-lg bg-canvas-alt/40 px-3 py-2"
                >
                  <span className="font-display text-base text-blue-500">
                    {r.id}
                  </span>
                  <span>{r.title.replace(/^Proposal \d+ — /, "")}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
