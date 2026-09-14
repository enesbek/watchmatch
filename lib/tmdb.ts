// TMDB entegrasyonu: Kalite filtresi (min IMDb/TMDB 6.0), Popüler vs Gizli Cevher (Hidden Gem) ayrımı.

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

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

function apiKey() {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB API key bulunamadı. .env.local dosyasına NEXT_PUBLIC_TMDB_API_KEY ekleyin."
    );
  }
  return key;
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "original" = "w500") {
  if (!path) return "/poster-placeholder.svg";
  return `${IMG_BASE}/${size}${path}`;
}

function normalize(raw: any, mediaType: MediaType): MediaItem {
  return {
    id: raw.id,
    media_type: mediaType,
    title: mediaType === "movie" ? raw.title : raw.name,
    overview: raw.overview,
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    vote_average: raw.vote_average,
    vote_count: raw.vote_count,
    release_date: mediaType === "movie" ? raw.release_date : raw.first_air_date,
    genre_ids: raw.genre_ids || [],
  };
}

/**
 * Lobi ayarlarına göre kart destesi çeker.
 * - minScore: Kalite filtresi (varsayılan 6.0)
 * - mode: popular (yüksek oy sayısı) | hidden_gems (7.0+ puan, düşük/orta oy sayısı) | mixed
 */
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

  const sortBy =
    mode === "hidden_gems" ? "vote_average.desc" : "popularity.desc";

  const voteCountGte = mode === "hidden_gems" ? 50 : 300;
  const voteCountLte = mode === "hidden_gems" ? 3000 : undefined;
  const effectiveMinScore = mode === "hidden_gems" ? Math.max(minScore, 7.0) : minScore;

  const url = new URL(`${TMDB_BASE}/discover/${mediaType}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "tr-TR");
  url.searchParams.set("sort_by", sortBy);
  url.searchParams.set("vote_average.gte", String(effectiveMinScore));
  url.searchParams.set("vote_count.gte", String(voteCountGte));
  if (voteCountLte) url.searchParams.set("vote_count.lte", String(voteCountLte));
  url.searchParams.set("page", String(page));
  url.searchParams.set("include_adult", "false");
  if (genreIds && genreIds.length > 0) {
    url.searchParams.set("with_genres", genreIds.join(","));
  }
  // watch_region + with_watch_providers eklenebilir (Netflix/Prime/Tod filtresi)

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB isteği başarısız: ${res.status}`);
  const data = await res.json();
  let items: MediaItem[] = (data.results || []).map((r: any) => normalize(r, mediaType));

  if (mode === "mixed") {
    // İkinci bir sayfayı popular sort ile çekip karıştır
    const url2 = new URL(url.toString());
    url2.searchParams.set("sort_by", "vote_average.desc");
    const res2 = await fetch(url2.toString());
    if (res2.ok) {
      const data2 = await res2.json();
      const extra: MediaItem[] = (data2.results || []).map((r: any) =>
        normalize(r, mediaType)
      );
      items = [...items, ...extra];
    }
    items = shuffle(items);
  }

  // Poster'ı olmayanları ele, tekrarları temizle
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
  const url = `${TMDB_BASE}/${mediaType}/${id}/videos?api_key=${apiKey()}&language=tr-TR`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  let vids = (data.results || []).filter(
    (v: any) => v.site === "YouTube" && v.type === "Trailer"
  );
  if (vids.length === 0) {
    // Türkçe fragman yoksa İngilizce dene
    const resEn = await fetch(
      `${TMDB_BASE}/${mediaType}/${id}/videos?api_key=${apiKey()}`
    );
    if (resEn.ok) {
      const dataEn = await resEn.json();
      vids = (dataEn.results || []).filter(
        (v: any) => v.site === "YouTube" && v.type === "Trailer"
      );
    }
  }
  return vids[0]?.key ?? null;
}

export interface WatchProvider {
  provider_name: string;
  logo_path: string;
}

/**
 * JustWatch verisi TMDB'nin watch/providers endpoint'i üzerinden gelir
 * (TMDB, JustWatch ile veri ortaklığı yapar).
 */
export async function fetchWatchProviders(
  mediaType: MediaType,
  id: number,
  region: string = "TR"
): Promise<{ link?: string; providers: WatchProvider[] }> {
  const url = `${TMDB_BASE}/${mediaType}/${id}/watch/providers?api_key=${apiKey()}`;
  const res = await fetch(url);
  if (!res.ok) return { providers: [] };
  const data = await res.json();
  const regionData = data.results?.[region];
  if (!regionData) return { providers: [] };
  const providers: WatchProvider[] = [
    ...(regionData.flatrate || []),
    ...(regionData.ads || []),
  ];
  return { link: regionData.link, providers };
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
