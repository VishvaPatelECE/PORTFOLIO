import Link from 'next/link';
import USMHACSPanel from '@/components/USMHACSPanel';

export default function USMHACSFullPage() {
  return (
    <main className="min-h-screen w-full overflow-y-auto bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-semibold text-[#e0e1dd] sm:text-2xl">USMHACS - Full System View</h1>
          <p className="mt-1 text-sm text-[#778da9]">
            Full-screen hardware logic simulator for detailed inspection, interaction, and scenario testing.
          </p>
        </div>
        <Link
          href="/usmhacs"
          className="btn-spectrum group text-xs font-medium"
        >
          <span className="btn-spectrum-layer" />
          <span className="btn-spectrum-text">Back</span>
        </Link>
      </div>

      <section className="w-full">
        <USMHACSPanel />
      </section>
    </main>
  );
}
