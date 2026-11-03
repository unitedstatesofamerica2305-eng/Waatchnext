import React, { useState } from 'react';
import { X, CheckCircle2, Trash2, Volume2, Star, Eye } from 'lucide-react';
import { MediaItem, MediaType } from '../types/media';

interface WatchedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchedIds: Set<string>;
  allMedia: MediaItem[];
  onToggleWatched: (id: string) => void;
  onClearAll: () => void;
  onSelectMedia: (item: MediaItem) => void;
}

export const WatchedDrawer: React.FC<WatchedDrawerProps> = ({
  isOpen,
  onClose,
  watchedIds,
  allMedia,
  onToggleWatched,
  onClearAll,
  onSelectMedia,
}) => {
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');

  if (!isOpen) return null;

  const watchedItems = allMedia.filter((item) => watchedIds.has(item.id));
  const filteredWatched = watchedItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const movieCount = watchedItems.filter((i) => i.type === 'movie').length;
  const seriesCount = watchedItems.filter((i) => i.type === 'series').length;
  const animeCount = watchedItems.filter((i) => i.type === 'anime').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-[#0F1424] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Watched History</h2>
              <p className="text-xs text-slate-400">
                {watchedItems.length} of {allMedia.length} titles marked as watched ({Math.round((watchedItems.length / allMedia.length) * 100)}% of catalog)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Strip */}
        <div className="px-6 py-3 bg-[#131A2E] border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 text-slate-300">
            <span>Movies: <strong className="text-white">{movieCount}</strong></span>
            <span>·</span>
            <span>Series: <strong className="text-white">{seriesCount}</strong></span>
            <span>·</span>
            <span>Anime: <strong className="text-white">{animeCount}</strong></span>
          </div>

          {watchedItems.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your watched history?')) {
                  onClearAll();
                }
              }}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {watchedItems.length > 0 && (
          <div className="px-6 pt-3 flex items-center gap-2">
            {(['all', 'movie', 'series', 'anime'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                  filterType === t
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        )}

        {/* List of items */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filteredWatched.length === 0 ? (
            <div className="py-12 text-center">
              <Eye className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No watched items here</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Mark movies, series, or anime as watched from the cards to track your watch history and hide them from future recommendations.
              </p>
            </div>
          ) : (
            filteredWatched.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#141B30] border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onSelectMedia(item);
                    onClose();
                  }}
                >
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-12 h-14 object-cover rounded-lg shrink-0 bg-slate-800"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                        {item.type}
                      </span>
                      <span className="text-xs text-amber-300 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {item.rating}
                      </span>
                      {item.hindiDubbed && (
                        <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                          <Volume2 className="w-3 h-3" />
                          Hindi Dub
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-sm text-white truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.releaseYear} · {item.durationOrSeasons}
                    </div>
                  </div>
                </div>

                {/* Unmark Button */}
                <button
                  onClick={() => onToggleWatched(item.id)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 border border-slate-700 hover:border-rose-800 text-slate-300 transition-colors shrink-0"
                  title="Remove from watched"
                >
                  Unmark
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
