import Link from 'next/link';
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

      <section className="w-full">
        <USMHACSPanel />
      </section>
    </main>
  );
}
