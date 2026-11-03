import React, { useState } from 'react';
import { X, Star, Check, Volume2, Clapperboard, Tv, Sparkles, ExternalLink, Share2, Tag } from 'lucide-react';
import { MediaItem } from '../types/media';

interface MediaDetailModalProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  isWatched: boolean;
  onToggleWatched: (id: string) => void;
  allMedia: MediaItem[];
  onSelectSimilar: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  isWatched,
  onToggleWatched,
  allMedia,
  onSelectSimilar,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !item) return null;

  // Find similar titles sharing genres
  const similarTitles = allMedia
    .filter((m) => m.id !== item.id && m.genres.some((g) => item.genres.includes(g)))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(
      `Check out ${item.title} (${item.releaseYear}) on CineMood - Rating ${item.rating}/10!`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-[#0F1424] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Header Visual Hero */}
        <div className="relative h-56 sm:h-72 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1424] via-[#0F1424]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-slate-300 hover:text-white hover:bg-black/80 transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-600/90 text-white uppercase tracking-wider">
                {item.type}
              </span>

              <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.rating.toFixed(1)} / 10</span>
              </span>

              {item.hindiDubbed ? (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500 text-slate-950 border border-amber-300 shadow-md">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Official Hindi Dub</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700">
                  Original Audio (Subs Only)
                </span>
              )}
            </div>

            {/* Quick Share */}
            <button
              onClick={handleShare}
              className="px-3 py-1 text-xs text-slate-300 bg-white/10 hover:bg-white/20 rounded-md backdrop-blur-md flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              {item.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mt-2">
              <span>{item.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span>{item.durationOrSeasons}</span>
              {item.directorOrCreator && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-300">Dir/Creator: {item.directorOrCreator}</span>
                </>
              )}
              {item.streamingPlatform && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-rose-400 font-medium">Available on {item.streamingPlatform}</span>
                </>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-[#161D32] border border-slate-800">
            <button
              onClick={() => onToggleWatched(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isWatched
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
              }`}
            >
              <Check className={`w-4 h-4 ${isWatched ? 'stroke-[3]' : ''}`} />
              <span>{isWatched ? 'Watched (Click to Unmark)' : 'Mark as Watched'}</span>
            </button>

            <span className="text-xs text-slate-400">
              {isWatched
                ? 'Added to your watched history. Stored locally in your browser.'
                : 'Keep your recommendations fresh by marking what you have already seen.'}
            </span>
          </div>

          {/* Synopsis */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Plot Overview
            </h4>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {item.synopsis}
            </p>
          </div>

          {/* Genres & Mood Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Genres
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-200 border border-slate-700"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Mood & Themes
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {item.moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-rose-950/40 text-rose-300 border border-rose-800/40"
                  >
                    <Tag className="w-3 h-3 text-rose-400" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cast */}
          {item.cast && item.cast.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Key Cast & Voices
              </h4>
              <p className="text-xs sm:text-sm text-slate-400">
                {item.cast.join(', ')}
              </p>
            </div>
          )}

          {/* Similar Recommendations */}
          {similarTitles.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                If you like this, check out:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarTitles.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectSimilar(sim)}
                    className="p-3 bg-[#161D32] hover:bg-[#1C2540] border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="uppercase font-semibold text-rose-400">{sim.type}</span>
                      <span className="font-bold text-amber-300">★ {sim.rating}</span>
                    </div>
                    <div className="font-semibold text-sm text-white truncate">
                      {sim.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {sim.genres.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
