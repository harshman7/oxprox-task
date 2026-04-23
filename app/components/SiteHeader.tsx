import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-canvas-alt bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:py-5">
        <Link
          href="/"
          aria-label="OxProx home"
          className="inline-flex items-center"
        >
          <Image
            src="/brand/oxprox-logo.svg"
            alt="OxProx"
            width={132}
            height={23}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-neutral sm:inline-block">
          Proxy voting intelligence
        </span>
      </div>
    </header>
  );
}
