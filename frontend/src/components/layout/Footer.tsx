'use client';

export function Footer() {
  return (
    <footer className="w-full py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="text-sm">Powered by</span>
            <span className="text-sm font-semibold text-zinc-300">Ethereum</span>
            <span className="text-zinc-700">•</span>
            <span className="text-sm text-zinc-500">Sepolia Testnet</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-zinc-600">
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Docs</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Support</span>
            <span className="hover:text-amber-400 transition-colors cursor-pointer">Terms</span>
          </div>

          <div className="text-sm text-zinc-600">
            © 2026 Crowdfunding
          </div>
        </div>
      </div>
    </footer>
  );
}