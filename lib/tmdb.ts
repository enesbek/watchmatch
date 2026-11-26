import mediaData from "@/data/media.json";

export type DiscoveryMode = "popular" | "hidden_gems" | "mixed";
export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  media_type: MediaType;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
}

const MEDIA = mediaData as MediaItem[];
const PAGE_SIZE = 20;

export function posterUrl(path: string | null, size: "w342" | "w500" | "original" = "w500") {
  if (!path) return "/poster-placeholder.svg";
  return path;
}

export async function fetchDeck(params: {
  mediaType: MediaType;
  mode: DiscoveryMode;
  minScore?: number;
  genreIds?: number[];
  page?: number;
}): Promise<MediaItem[]> {
  const { mediaType, mode, genreIds } = params;
  const minScore = params.minScore ?? 6.0;
  const page = params.page ?? 1;

  const voteCountGte = mode === "hidden_gems" ? 50 : 300;
  const voteCountLte = mode === "hidden_gems" ? 3000 : undefined;
  const effectiveMinScore = mode === "hidden_gems" ? Math.max(minScore, 7.0) : minScore;

  const filtered = MEDIA.filter(
    (i) =>
      i.media_type === mediaType &&
      i.vote_average >= effectiveMinScore &&
      i.vote_count >= voteCountGte &&
      (voteCountLte === undefined || i.vote_count <= voteCountLte) &&
      (!genreIds || genreIds.length === 0 || genreIds.every((g) => i.genre_ids.includes(g)))
  );

  const byPopularity = [...filtered].sort((a, b) => b.vote_count - a.vote_count);
  const byRating = [...filtered].sort((a, b) => b.vote_average - a.vote_average);
  const paginate = (list: MediaItem[]) =>
    list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  let items = paginate(mode === "hidden_gems" ? byRating : byPopularity);

  if (mode === "mixed") {
    items = shuffle([...items, ...paginate(byRating)]);
  }

  const seen = new Set<number>();
  return items.filter((i) => {
    if (!i.poster_path || seen.has(i.id)) return false;
    seen.add(i.id);
    return true;
  });
}

export async function fetchTrailerKey(
  mediaType: MediaType,
  id: number
): Promise<string | null> {
  return null;
}

export interface WatchProvider {
  provider_name: string;
  logo_path: string;
}

export async function fetchWatchProviders(
  mediaType: MediaType,
  id: number,
  region: string = "TR"
): Promise<{ link?: string; providers: WatchProvider[] }> {
  return { providers: [] };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
