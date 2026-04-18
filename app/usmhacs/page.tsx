import Link from 'next/link';
import Image from 'next/image';
import USMHACSPanel from '@/components/USMHACSPanel';

export default function USMHACSPage() {
  return (
    <main className="min-h-screen w-full overflow-y-auto bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#e0e1dd] sm:text-2xl">USMHACS - Hardware Deterministic Security System</h1>
          <p className="mt-1 text-sm text-[#778da9]">
            Hardware-enforced access control architecture with deterministic logic execution and tamper-resilient lockout.
          </p>
        </div>
        <Link
          href="/#projects"
          className="btn-spectrum group text-xs font-medium"
        >
          <span className="btn-spectrum-layer" />
          <span className="btn-spectrum-text">Back to Portfolio</span>
        </Link>
      </div>

      <section className="w-full lg:hidden">
        <article className="panel-card space-y-4 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-[#e0e1dd]">USMHACS Full System View</h2>
          <p className="text-sm leading-relaxed text-[#778da9]">
            The full USMHACS interface includes an interactive hardware logic diagram, signal-flow simulation, and event console for scenario validation.
          </p>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0d1b2a]/70">
            <Image
              src="/usmhacs-preview.svg"
              alt="USMHACS system preview"
              width={1200}
              height={720}
              className="h-auto w-full"
              priority
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/usmhacs/full"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spectrum group inline-flex items-center text-sm font-semibold"
            >
              <span className="btn-spectrum-layer" />
              <span className="btn-spectrum-text">Open Full System View</span>
            </Link>
            <p className="text-xs text-[#ffd60a]">Best viewed on larger screens.</p>
          </div>
        </article>
      </section>

      <section className="hidden w-full lg:block">
        <USMHACSPanel />
      </section>
    </main>
  );
}
