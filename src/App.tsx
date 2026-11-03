import React, { useState, useMemo, useCallback } from 'react';
import { MOCK_MEDIA_DATABASE } from './data/mockDatabase';
import { MediaItem, FilterState, TypeFilter, SortOption } from './types/media';
import { filterAndRankMedia } from './utils/recommender';
import { useWatchedList } from './hooks/useWatchedList';
import { Navbar } from './components/Navbar';
import { SearchAndMoodBar } from './components/SearchAndMoodBar';
import { FilterBar } from './components/FilterBar';
import { MediaCard } from './components/MediaCard';
import { MediaDetailModal } from './components/MediaDetailModal';
import { WatchedDrawer } from './components/WatchedDrawer';
import { SurpriseModal } from './components/SurpriseModal';
import { RunGuideModal } from './components/RunGuideModal';
import { Film, Sparkles, SlidersHorizontal, CheckCircle2, Volume2, HelpCircle } from 'lucide-react';

export default function App() {
  // Watched state with localStorage persistence
  const {
    watchedIds,
    toggleWatched,
    clearAllWatched,
    isWatched,
    count: watchedCount,
  } = useWatchedList();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    typeFilter: 'all',
    selectedGenre: 'All',
    hindiDubbedOnly: false,
    hideWatched: true, // Default to true as per requirements: "so previously watched titles never show up in recommendations"
    sortBy: 'recommended',
  });

  // Modals state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isWatchedModalOpen, setIsWatchedModalOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Handlers for filters
  const handleQueryChange = useCallback((newQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: newQuery }));
  }, []);

  const handleClearQuery = useCallback(() => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  }, []);

  const handleTypeChange = useCallback((type: TypeFilter) => {
    setFilters((prev) => ({ ...prev, typeFilter: type }));
  }, []);

  const handleGenreChange = useCallback((genre: string) => {
    setFilters((prev) => ({ ...prev, selectedGenre: genre }));
  }, []);

  const handleToggleHindiOnly = useCallback(() => {
    setFilters((prev) => ({ ...prev, hindiDubbedOnly: !prev.hindiDubbedOnly }));
  }, []);

  const handleToggleHideWatched = useCallback(() => {
    setFilters((prev) => ({ ...prev, hideWatched: !prev.hideWatched }));
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy: sort }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      searchQuery: '',
      typeFilter: 'all',
      selectedGenre: 'All',
      hindiDubbedOnly: false,
      hideWatched: false,
      sortBy: 'recommended',
    });
  }, []);

  // Card watched toggle
  const handleCardToggleWatched = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      toggleWatched(id);
    },
    [toggleWatched]
  );

  // Compute filtered & ranked recommendations
  const recommendations = useMemo(() => {
    return filterAndRankMedia(MOCK_MEDIA_DATABASE, filters, watchedIds);
  }, [filters, watchedIds]);

  // Compute hidden watched count
  const hiddenWatchedCount = useMemo(() => {
    // Count how many items in database match other active filters, but were hidden solely because they are watched
    const withoutHideWatchedFilters = { ...filters, hideWatched: false };
    const allMatches = filterAndRankMedia(MOCK_MEDIA_DATABASE, withoutHideWatchedFilters, watchedIds);
    return allMatches.filter((item) => watchedIds.has(item.id)).length;
  }, [filters, watchedIds]);

  // Total available Hindi Dubbed in database
  const totalHindiDubbed = useMemo(() => {
    return MOCK_MEDIA_DATABASE.filter((i) => i.hindiDubbed).length;
  }, []);

  // Check if any non-default filter is applied
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    filters.typeFilter !== 'all' ||
    filters.selectedGenre !== 'All' ||
    filters.hindiDubbedOnly;

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        watchedCount={watchedCount}
        hindiDubbedCount={totalHindiDubbed}
        onOpenWatched={() => setIsWatchedModalOpen(true)}
        onOpenSurprise={() => setIsSurpriseModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onFilterHindiOnly={handleToggleHindiOnly}
        isHindiOnly={filters.hindiDubbedOnly}
      />

      {/* Main Content Area */}
      <main id="discover" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16">
        {/* Smart Mood & Filter Search */}
        <SearchAndMoodBar
          query={filters.searchQuery}
          onChangeQuery={handleQueryChange}
          onClear={handleClearQuery}
        />

        {/* Quick Filter Bar & Global Toggles */}
        <FilterBar
          typeFilter={filters.typeFilter}
          onChangeType={handleTypeChange}
          selectedGenre={filters.selectedGenre}
          onChangeGenre={handleGenreChange}
          hindiDubbedOnly={filters.hindiDubbedOnly}
          onToggleHindiOnly={handleToggleHindiOnly}
          hideWatched={filters.hideWatched}
          onToggleHideWatched={handleToggleHideWatched}
          sortBy={filters.sortBy}
          onChangeSort={handleSortChange}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalFilteredCount={recommendations.length}
          hiddenWatchedCount={hiddenWatchedCount}
        />

        {/* Media Recommendation Grid */}
        <section className="pt-6">
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {recommendations.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  isWatched={isWatched(item.id)}
                  onToggleWatched={handleCardToggleWatched}
                  onSelect={(selected) => setSelectedMedia(selected)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center bg-[#101524]/60 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Film className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                No matching titles found
              </h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                {filters.hideWatched && hiddenWatchedCount > 0
                  ? `All ${hiddenWatchedCount} matching titles are currently in your watched list. Disable "Hide Watched" or unmark them to view.`
                  : filters.hindiDubbedOnly
                  ? 'No titles match this combination with Hindi Dubbing. Try toggling off Hindi Dub Only or trying another genre.'
                  : 'Try broadening your search query or picking different mood tags.'}
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                {filters.hideWatched && hiddenWatchedCount > 0 && (
                  <button
                    onClick={handleToggleHideWatched}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    Show Hidden Watched Titles ({hiddenWatchedCount})
                  </button>
                )}
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Feature Highlights Banner */}
        <section className="mt-16 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400 text-xs">
            <div className="p-4 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-1">
                  Semantic Mood Engine
                </h4>
                <p className="leading-relaxed">
                  Type phrases like <em>"heist with mind games"</em> or <em>"psychological anime in Hindi"</em>. The NLP parser extracts tropes and guarantees strict Hindi dub compliance.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-1">
                  Persistent Watched Tracking
                </h4>
                <p className="leading-relaxed">
                  Toggle any title as watched. The app remembers everything across browser refreshes via localStorage and automatically hides them from new recommendations.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1424] border border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-1">
                  Official Hindi Dub Verification
                </h4>
                <p className="leading-relaxed">
                  Clear visual audio badges distinguish officially Hindi-dubbed releases from original audio subtitle releases on Netflix, Crunchyroll, and Prime Video.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>CineMood · Curated recommendations for psychological, heist & strategic thrillers</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>StackBlitz & CodeSandbox Guide</span>
            </button>
            <button
              onClick={() => setIsWatchedModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              Watched History ({watchedCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Full Detail Modal */}
      <MediaDetailModal
        item={selectedMedia}
        isOpen={Boolean(selectedMedia)}
        onClose={() => setSelectedMedia(null)}
        isWatched={selectedMedia ? isWatched(selectedMedia.id) : false}
        onToggleWatched={toggleWatched}
        allMedia={MOCK_MEDIA_DATABASE}
        onSelectSimilar={(similarItem) => setSelectedMedia(similarItem)}
      />

      {/* Watched History Drawer / Modal */}
      <WatchedDrawer
        isOpen={isWatchedModalOpen}
        onClose={() => setIsWatchedModalOpen(false)}
        watchedIds={watchedIds}
        allMedia={MOCK_MEDIA_DATABASE}
        onToggleWatched={toggleWatched}
        onClearAll={clearAllWatched}
        onSelectMedia={(item) => setSelectedMedia(item)}
      />

      {/* Surprise Recommendation Roulette */}
      <SurpriseModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        pool={recommendations}
        onSelectMedia={(item) => setSelectedMedia(item)}
      />

      {/* StackBlitz / CodeSandbox / Local Run Guide */}
      <RunGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
