export type MediaType = 'movie' | 'series' | 'anime';

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  genres: string[];
  rating: number;
  coverImage: string;
  hindiDubbed: boolean;
  releaseYear: number;
  durationOrSeasons: string;
  synopsis: string;
  moodTags: string[];
  directorOrCreator?: string;
  cast?: string[];
  streamingPlatform?: string;
  matchScore?: number;
  matchedFeatures?: string[];
}

export type TypeFilter = 'all' | MediaType;

export type SortOption = 'recommended' | 'rating-desc' | 'year-desc' | 'title-asc';

export interface FilterState {
  searchQuery: string;
  typeFilter: TypeFilter;
  selectedGenre: string;
  hindiDubbedOnly: boolean;
  hideWatched: boolean;
  sortBy: SortOption;
}
