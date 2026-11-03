import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cinemood_watched_ids_v1';

export function useWatchedList() {
  const [watchedIds, setWatchedIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read watched list from localStorage', e);
    }
    // Default initial sample watched item for quick demo or empty set
    return new Set<string>();
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(watchedIds)));
    } catch (e) {
      console.warn('Could not save watched list to localStorage', e);
    }
  }, [watchedIds]);

  const toggleWatched = useCallback((id: string) => {
    setWatchedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const markWatched = useCallback((id: string) => {
    setWatchedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unmarkWatched = useCallback((id: string) => {
    setWatchedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const isWatched = useCallback((id: string) => {
    return watchedIds.has(id);
  }, [watchedIds]);

  const clearAllWatched = useCallback(() => {
    setWatchedIds(new Set());
  }, []);

  return {
    watchedIds,
    toggleWatched,
    markWatched,
    unmarkWatched,
    isWatched,
    clearAllWatched,
    count: watchedIds.size
  };
}
