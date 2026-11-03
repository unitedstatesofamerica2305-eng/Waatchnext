import React from 'react';
import { Search, Sparkles, X, Volume2, ShieldCheck, Tag } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '../data/mockDatabase';
import { parseMoodPrompt } from '../utils/recommender';

interface SearchAndMoodBarProps {
  query: string;
  onChangeQuery: (newQuery: string) => void;
  onClear: () => void;
}

export const SearchAndMoodBar: React.FC<SearchAndMoodBarProps> = ({
  query,
  onChangeQuery,
  onClear,
}) => {
  const analysis = query.trim() ? parseMoodPrompt(query) : null;

  return (
    <section className="relative pt-6 pb-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>AI & Semantic Natural Language Recommender</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display text-balance">
            What are you in the mood for?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Describe the plot, thrill, or vibe you want. We will parse genres, tropes, and strict Hindi dubbing preferences instantly.
          </p>
        </div>

        {/* Input Bar */}
        <div className="relative group">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-rose-600/30 via-purple-600/20 to-amber-600/30 blur-lg opacity-75 group-hover:opacity-100 transition duration-300 pointer-events-none" />

          <div className="relative flex items-center bg-[#101524] border border-slate-700/80 rounded-2xl shadow-2xl focus-within:border-rose-500/80 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <div className="pl-4.5 pr-2 py-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-rose-400" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
              placeholder="e.g. &quot;I want a heist movie with action and mind games&quot; or &quot;psychological anime in Hindi&quot;..."
              className="w-full py-4 pr-10 text-sm sm:text-base bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />

            {query && (
              <button
                onClick={onClear}
                className="p-2 mr-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Clear prompt"
                aria-label="Clear search input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Smart Extraction Indicator */}
        {analysis && (analysis.detectedKeywords.length > 0 || analysis.requiresHindi || analysis.targetType) && (
          <div className="mt-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex flex-wrap items-center gap-2 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              Smart Match Applied:
            </span>

            {analysis.targetType && (
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold uppercase tracking-wider text-[11px]">
                {analysis.targetType}
              </span>
            )}

            {analysis.requiresHindi && (
              <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-medium flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-amber-400" />
                Strict Hindi Dub Required
              </span>
            )}

            {analysis.detectedGenres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-rose-400" />
                {genre}
              </span>
            ))}

            {analysis.minRating && (
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                {analysis.minRating}+ Rating
              </span>
            )}
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-400 text-xs mr-1 shrink-0">Try mood prompts:</span>
          {PROMPT_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onChangeQuery(suggestion)}
              className={`px-3 py-1.5 rounded-lg border transition-all text-left truncate max-w-[280px] sm:max-w-none ${
                query === suggestion
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-200 font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
