import React, { useState } from 'react';
import { X, Sparkles, Star, Volume2, ArrowRight } from 'lucide-react';
import { MediaItem } from '../types/media';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  pool: MediaItem[];
  onSelectMedia: (item: MediaItem) => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  pool,
  onSelectMedia,
}) => {
  const [selected, setSelected] = useState<MediaItem | null>(() => {
    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
    return null;
  });

  const [isShuffling, setIsShuffling] = useState(false);

  if (!isOpen) return null;

  const handleShuffle = () => {
    if (pool.length <= 1) return;
    setIsShuffling(true);
    let counter = 0;
    const interval = setInterval(() => {
      const randomItem = pool[Math.floor(Math.random() * pool.length)];
      setSelected(randomItem);
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsShuffling(false);
      }
    }, 90);
  };

  const currentItem = selected || pool[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-[#0F1424] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h3 className="font-display font-bold text-lg text-white">
              CineMood Roulette
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        {currentItem ? (
          <div className="p-6 text-center space-y-4">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-700 mx-auto shadow-xl">
              <img
                src={currentItem.coverImage}
                alt={currentItem.title}
                className={`w-full h-full object-cover transition-all duration-200 ${
                  isShuffling ? 'scale-110 blur-xs brightness-125' : 'scale-100 blur-none'
                }`}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <span className="uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-600/90">
                  {currentItem.type}
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-300 bg-black/60 px-2 py-0.5 rounded">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {currentItem.rating}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-extrabold text-white font-display">
                {currentItem.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {currentItem.releaseYear} · {currentItem.durationOrSeasons} · {currentItem.genres.join(', ')}
              </p>
              {currentItem.hindiDubbed && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Volume2 className="w-3 h-3" />
                  <span>Official Hindi Dub Available</span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 line-clamp-3 italic px-2">
              "{currentItem.synopsis}"
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleShuffle}
                disabled={isShuffling || pool.length <= 1}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
              >
                {isShuffling ? 'Spinning...' : 'Reroll Pick'}
              </button>

              <button
                onClick={() => {
                  onSelectMedia(currentItem);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md hover:from-rose-500 hover:to-amber-500 transition-all"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            No recommendations match your current filters. Try resetting filters or search prompts!
          </div>
        )}
      </div>
    </div>
  );
};
