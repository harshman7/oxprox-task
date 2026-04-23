import Image from "next/image";

export default function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-ink text-white dark:bg-[#0b1632]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/brand/oxprox-pattern-white.svg')] bg-cover bg-center opacity-[0.10]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:py-14">
        <div className="flex items-center gap-4">
          <Image
            src="/brand/oxprox-logo-white.svg"
            alt="OxProx"
            width={208}
            height={36}
            className="h-8 w-auto sm:h-9"
          />
        </div>
        <p className="max-w-md text-xs leading-relaxed text-white/70">
          Fictional dataset prepared for the OxProx take-home exercise.
          Typography and colours follow the OxProx Brand Guidelines
          (September 2025).
        </p>
      </div>
    </footer>
  );
}
