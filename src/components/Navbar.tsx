import React from 'react';
import { Film, Sparkles, CheckCircle2, BookOpen, Volume2 } from 'lucide-react';

interface NavbarProps {
  watchedCount: number;
  hindiDubbedCount: number;
  onOpenWatched: () => void;
  onOpenSurprise: () => void;
  onOpenGuide: () => void;
  onFilterHindiOnly: () => void;
  isHindiOnly: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  watchedCount,
  hindiDubbedCount,
  onOpenWatched,
  onOpenSurprise,
  onOpenGuide,
  onFilterHindiOnly,
  isHindiOnly,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white font-display">
              Cine<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Mood</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a
            href="#discover"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Discover
          </a>
          <button
            onClick={onFilterHindiOnly}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isHindiOnly ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Hindi Dubs</span>
            <span className="text-xs px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
              {hindiDubbedCount}
            </span>
          </button>
          <button
            onClick={onOpenWatched}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Watched List</span>
            {watchedCount > 0 && (
              <span className="text-xs px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 rounded">
                {watchedCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-slate-400"
          >
            <BookOpen className="w-4 h-4" />
            <span>Run in Editor</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSurprise}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:scale-98 rounded-lg shadow-md shadow-rose-950/50 transition-all whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surprise Me</span>
          </button>
        </div>
      </div>
    </header>
  );
};
