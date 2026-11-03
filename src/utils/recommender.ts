import { MediaItem, FilterState, MediaType } from '../types/media';

export interface ParsedMood {
  targetType?: MediaType;
  requiresHindi: boolean;
  minRating?: number;
  detectedKeywords: string[];
  detectedGenres: string[];
}

export function parseMoodPrompt(prompt: string): ParsedMood {
  const normalized = prompt.toLowerCase().trim();
  const detectedKeywords: string[] = [];
  const detectedGenres: string[] = [];

  // Check Hindi dub intent
  const hindiRegex = /\b(hindi|hindi dubbed|hindi dub|in hindi|with hindi|hindi audio|dubbed)\b/i;
  const requiresHindi = hindiRegex.test(normalized);
  if (requiresHindi) {
    detectedKeywords.push('Hindi Dub');
  }

  // Check media type intent
  let targetType: MediaType | undefined = undefined;
  if (/\b(anime|animation|manga)\b/i.test(normalized)) {
    targetType = 'anime';
    detectedKeywords.push('Anime');
  } else if (/\b(movie|film|cinema|flick)\b/i.test(normalized)) {
    targetType = 'movie';
    detectedKeywords.push('Movie');
  } else if (/\b(series|show|tv show|tv series|seasons?)\b/i.test(normalized)) {
    targetType = 'series';
    detectedKeywords.push('Series');
  }

  // Check rating intent
  let minRating: number | undefined = undefined;
  if (/\b(top rated|best rated|masterpiece)\b/i.test(normalized)) {
    minRating = 8.5;
    detectedKeywords.push('Top Rated (8.5+)');
  } else if (/\b(9\+|above 9|9\.0\+)\b/i.test(normalized)) {
    minRating = 9.0;
    detectedKeywords.push('9.0+ Rating');
  } else if (/\b(8\.5\+|above 8\.5)\b/i.test(normalized)) {
    minRating = 8.5;
    detectedKeywords.push('8.5+ Rating');
  } else if (/\b(8\+|above 8|8\.0\+)\b/i.test(normalized)) {
    minRating = 8.0;
    detectedKeywords.push('8.0+ Rating');
  }

  // Genre & Theme detection
  const genreKeywordMap: Record<string, string[]> = {
    'Heist': ['heist', 'robbery', 'bank', 'vault', 'steal', 'thief', 'money', 'con', 'getaway'],
    'Psychological': ['psychological', 'psycho', 'mental', 'mind', 'sanity', 'paranoia', 'obsession', 'manipulation'],
    'Mind Games': ['mind games', 'mind game', 'mind-bending', 'intellectual', 'cat and mouse', 'chess', 'genius', 'deduction', 'puzzle', 'twists'],
    'Strategic Drama': ['strategic', 'strategy', 'tactical', 'rebellion', 'geopolitical', 'scheming', 'calculation', 'politics'],
    'Action': ['action', 'adrenaline', 'fast-paced', 'explosive', 'fight', 'gunplay', 'chase'],
    'Crime': ['crime', 'criminal', 'mafia', 'gang', 'underworld', 'cartel', 'detective', 'fbi', 'police', 'investigation'],
    'Sci-Fi': ['sci-fi', 'scifi', 'science fiction', 'time travel', 'futuristic', 'cyberpunk', 'dream', 'technology'],
    'Mystery': ['mystery', 'mysterious', 'unsolved', 'whodunit', 'secrets', 'conspiracy'],
    'Thriller': ['thriller', 'suspense', 'tension', 'edge of seat', 'dark', 'intense']
  };

  for (const [genre, keywords] of Object.entries(genreKeywordMap)) {
    const matched = keywords.some(kw => normalized.includes(kw));
    if (matched) {
      detectedGenres.push(genre);
      detectedKeywords.push(genre);
    }
  }

  return {
    targetType,
    requiresHindi,
    minRating,
    detectedKeywords,
    detectedGenres
  };
}

export function filterAndRankMedia(
  items: MediaItem[],
  filters: FilterState,
  watchedIds: Set<string>
): MediaItem[] {
  const { searchQuery, typeFilter, selectedGenre, hindiDubbedOnly, hideWatched, sortBy } = filters;
  const promptAnalysis = searchQuery ? parseMoodPrompt(searchQuery) : null;
  const normalizedQuery = searchQuery.toLowerCase().trim();

  // Step 1: Base filtration
  const filtered = items.filter(item => {
    // 1. Hide watched filter
    if (hideWatched && watchedIds.has(item.id)) {
      return false;
    }

    // 2. Strict Hindi Dub filter (either via explicit UI toggle OR parsed prompt intent)
    const strictHindiNeeded = hindiDubbedOnly || (promptAnalysis?.requiresHindi ?? false);
    if (strictHindiNeeded && !item.hindiDubbed) {
      return false;
    }

    // 3. Type filter
    if (typeFilter !== 'all' && item.type !== typeFilter) {
      return false;
    }
    // If prompt explicitly requested a type and user left UI filter on 'all'
    if (promptAnalysis?.targetType && typeFilter === 'all' && item.type !== promptAnalysis.targetType) {
      return false;
    }

    // 4. Selected genre pill filter
    if (selectedGenre && selectedGenre !== 'All') {
      const hasGenre = item.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase());
      if (!hasGenre) {
        return false;
      }
    }

    // 5. Min rating from prompt
    if (promptAnalysis?.minRating && item.rating < promptAnalysis.minRating) {
      return false;
    }

    return true;
  });

  // Step 2: Scoring & Recommending
  const scoredItems = filtered.map(item => {
    let score = item.rating * 5; // Base score from rating (out of 50)
    const matchedFeatures: string[] = [];

    if (item.hindiDubbed) {
      matchedFeatures.push('Hindi Dub');
    }

    if (promptAnalysis && normalizedQuery) {
      const titleLower = item.title.toLowerCase();
      const synopsisLower = item.synopsis.toLowerCase();
      const moodTagsLower = item.moodTags.map(t => t.toLowerCase()).join(' ');
      const genresLower = item.genres.map(g => g.toLowerCase()).join(' ');

      // Exact title match boost
      if (titleLower.includes(normalizedQuery)) {
        score += 80;
        matchedFeatures.push('Title Match');
      }

      // Check detected genres
      for (const genre of promptAnalysis.detectedGenres) {
        if (item.genres.some(g => g.toLowerCase() === genre.toLowerCase())) {
          score += 25;
          if (!matchedFeatures.includes(genre)) {
            matchedFeatures.push(genre);
          }
        }
      }

      // Check keywords in mood tags or synopsis
      const words = normalizedQuery.split(/\s+/).filter(w => w.length > 2 && !['want', 'with', 'and', 'the', 'for', 'like'].includes(w));
      let wordMatches = 0;
      for (const word of words) {
        if (titleLower.includes(word)) {
          score += 15;
          wordMatches++;
        }
        if (genresLower.includes(word)) {
          score += 12;
          wordMatches++;
        }
        if (moodTagsLower.includes(word)) {
          score += 10;
          wordMatches++;
        }
        if (synopsisLower.includes(word)) {
          score += 6;
          wordMatches++;
        }
      }

      if (wordMatches > 0) {
        score += Math.min(wordMatches * 5, 30);
      }
    }

    // Add highlighted match reason
    return {
      ...item,
      matchScore: Math.round(score),
      matchedFeatures: Array.from(new Set(matchedFeatures)).slice(0, 4)
    };
  });

  // Step 3: Sorting
  return scoredItems.sort((a, b) => {
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating;
    }
    if (sortBy === 'year-desc') {
      return b.releaseYear - a.releaseYear;
    }
    if (sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    }
    // Default 'recommended'
    if (searchQuery && promptAnalysis) {
      return (b.matchScore ?? 0) - (a.matchScore ?? 0);
    }
    return b.rating - a.rating;
  });
}
