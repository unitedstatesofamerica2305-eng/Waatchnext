import React, { useState } from 'react';
import { Star, Check, Volume2, Clapperboard, Tv, Sparkles } from 'lucide-react';
import { MediaItem } from '../types/media';

interface MediaCardProps {
  item: MediaItem;
  isWatched: boolean;
  onToggleWatched: (id: string, e: React.MouseEvent) => void;
  onSelect: (item: MediaItem) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  item,
  isWatched,
  onToggleWatched,
  onSelect,
}) => {
  const [imageError, setImageError] = useState(false);

  // Type badge styling
  const getTypeBadge = () => {
    switch (item.type) {
      case 'movie':
        return {
          label: 'Movie',
          icon: <Clapperboard className="w-3 h-3" />,
          classes: 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60',
        };
      case 'series':
        return {
          label: 'Series',
          icon: <Tv className="w-3 h-3" />,
          classes: 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60',
        };
      case 'anime':
        return {
          label: 'Anime',
          icon: <Sparkles className="w-3 h-3" />,
          classes: 'bg-fuchsia-950/90 text-fuchsia-300 border-fuchsia-700/60',
        };
    }
  };

  const typeBadge = getTypeBadge();

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group relative flex flex-col bg-[#101524] rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isWatched
          ? 'border-emerald-800/40 opacity-75 hover:opacity-100 hover:border-emerald-600/70'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-2xl hover:shadow-rose-950/20 hover:-translate-y-1'
      }`}
    >
      {/* Media Poster & Cover Image */}
      <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden bg-slate-900">
        {!imageError ? (
          <img
            src={item.coverImage}
            alt={item.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* High-Fidelity Thematic SVG Poster Fallback */
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <Clapperboard className="w-6 h-6 text-rose-400" />
            </div>
            <span className="font-display font-bold text-white text-sm line-clamp-1">
              {item.title}
            </span>
            <span className="text-xs text-slate-400 mt-1">{item.genres[0]}</span>
          </div>
        )}

        {/* Gradient Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101524] via-transparent to-black/60 pointer-events-none" />

        {/* Top Badges Bar */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
          {/* Type Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border backdrop-blur-md uppercase tracking-wide ${typeBadge.classes}`}
          >
            {typeBadge.icon}
            <span>{typeBadge.label}</span>
          </span>

          {/* Rating Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-950/90 text-amber-300 border border-amber-600/60 backdrop-blur-md tabular-nums shadow-sm">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Hindi Dubbed Indicator (Prominent Banner) */}
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          {item.hindiDubbed ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/95 text-slate-950 border border-amber-300 shadow-md backdrop-blur-sm">
              <Volume2 className="w-3 h-3" />
              <span>Hindi Dub Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-slate-400 border border-white/10 backdrop-blur-sm">
              <span>Original Audio (Subs)</span>
            </span>
          )}
        </div>

        {/* Watched Overlay Flag */}
        {isWatched && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white shadow-lg">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Watched</span>
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Metadata */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-rose-400 transition-colors line-clamp-1">
              {item.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 mb-2.5">
            <span>{item.releaseYear}</span>
            <span aria-hidden="true">·</span>
            <span>{item.durationOrSeasons}</span>
            {item.streamingPlatform && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{item.streamingPlatform}</span>
              </>
            )}
          </div>

          {/* Synopsis preview */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {item.synopsis}
          </p>

          {/* Genres (unboxed metadata with subtle dots as per frontend-design guidelines) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-3">
            {item.genres.slice(0, 3).map((genre, idx) => (
              <React.Fragment key={genre}>
                <span className="text-slate-300">{genre}</span>
                {idx < Math.min(item.genres.length - 1, 2) && (
                  <span className="text-slate-600">·</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Highlight match reason if matched */}
          {item.matchedFeatures && item.matchedFeatures.length > 0 && (
            <div className="mb-3 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-[11px] text-rose-300/90 flex items-center gap-1.5">
              <span className="font-semibold text-rose-400">Match:</span>
              <span className="truncate">{item.matchedFeatures.join(' · ')}</span>
            </div>
          )}
        </div>

        {/* Card Action Footer with Interactive "Mark as Watched" */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <button
            onClick={(e) => onToggleWatched(item.id, e)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isWatched
                ? 'bg-emerald-950/80 border border-emerald-600/70 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200'
            }`}
            title={isWatched ? 'Mark as unwatched' : 'Mark as watched'}
            aria-label={isWatched ? `Mark ${item.title} as unwatched` : `Mark ${item.title} as watched`}
          >
            <Check
              className={`w-3.5 h-3.5 transition-transform ${
                isWatched ? 'text-emerald-400 scale-110' : 'text-slate-400'
              }`}
            />
            <span>{isWatched ? 'Watched' : 'Mark as Watched'}</span>
          </button>

          <button
            onClick={() => onSelect(item)}
            className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};
