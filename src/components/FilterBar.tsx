import React from 'react';
import { EyeOff, Eye, Volume2, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { TypeFilter, SortOption } from '../types/media';
import { POPULAR_GENRES } from '../data/mockDatabase';

interface FilterBarProps {
  typeFilter: TypeFilter;
  onChangeType: (type: TypeFilter) => void;
  selectedGenre: string;
  onChangeGenre: (genre: string) => void;
  hindiDubbedOnly: boolean;
  onToggleHindiOnly: () => void;
  hideWatched: boolean;
  onToggleHideWatched: () => void;
  sortBy: SortOption;
  onChangeSort: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFilteredCount: number;
  hiddenWatchedCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  typeFilter,
  onChangeType,
  selectedGenre,
  onChangeGenre,
  hindiDubbedOnly,
  onToggleHindiOnly,
  hideWatched,
  onToggleHideWatched,
  sortBy,
  onChangeSort,
  onResetFilters,
  hasActiveFilters,
  totalFilteredCount,
  hiddenWatchedCount,
}) => {
  return (
    <div className="space-y-4 pt-4 pb-2 border-b border-slate-800/80">
      {/* Top Row: Type Segments & Quick Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Type Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#101524] border border-slate-800 rounded-xl overflow-x-auto">
          {(
            [
              { id: 'all', label: 'All Titles' },
              { id: 'movie', label: 'Movies' },
              { id: 'series', label: 'Series' },
              { id: 'anime', label: 'Anime' },
            ] as const
          ).map((tab) => {
            const isActive = typeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeType(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Global Toggles and Sort */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Hindi Dubbed Switch Toggle */}
          <button
            onClick={onToggleHindiOnly}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              hindiDubbedOnly
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-950/40'
                : 'bg-[#101524] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Filter to only titles with official Hindi dub"
          >
            <Volume2
              className={`w-4 h-4 ${
                hindiDubbedOnly ? 'text-amber-400' : 'text-slate-400'
              }`}
            />
            <span>Hindi Dubbed Only</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hindiDubbedOnly ? 'bg-amber-400' : 'bg-slate-600'
              }`}
            />
          </button>

          {/* Hide Watched Items Toggle */}
          <button
            onClick={onToggleHideWatched}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              hideWatched
                ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-950/40'
                : 'bg-[#101524] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title="Hide previously watched titles from recommendations"
          >
            {hideWatched ? (
              <EyeOff className="w-4 h-4 text-emerald-400" />
            ) : (
              <Eye className="w-4 h-4 text-slate-400" />
            )}
            <span>Hide Watched</span>
            {hiddenWatchedCount > 0 && hideWatched && (
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                {hiddenWatchedCount} hidden
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101524] border border-slate-800 rounded-xl text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onChangeSort(e.target.value as SortOption)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-[#101524] text-white">
                Best Match
              </option>
              <option value="rating-desc" className="bg-[#101524] text-white">
                Highest Rated
              </option>
              <option value="year-desc" className="bg-[#101524] text-white">
                Newest Release
              </option>
              <option value="title-asc" className="bg-[#101524] text-white">
                Title (A-Z)
              </option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 text-xs transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Genre Pills Scrollable */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        <span className="text-xs text-slate-500 font-medium mr-1.5 shrink-0">Genres:</span>
        {POPULAR_GENRES.map((genre) => {
          const isSelected = selectedGenre === genre;
          return (
            <button
              key={genre}
              onClick={() => onChangeGenre(genre)}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-slate-200 text-slate-900 border-slate-200 font-semibold shadow-sm'
                  : 'bg-[#101524] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>

      {/* Info Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          Showing <span className="font-semibold text-slate-300">{totalFilteredCount}</span>{' '}
          recommendations
          {hiddenWatchedCount > 0 && hideWatched && (
            <span>
              {' '}
              · <span className="text-emerald-400/90 font-medium">{hiddenWatchedCount}</span> watched
              titles hidden
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
