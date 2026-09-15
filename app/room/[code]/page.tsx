"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import SwipeCard from "@/components/SwipeCard";
import TrailerModal from "@/components/TrailerModal";
import MatchModal from "@/components/MatchModal";
import { fetchDeck, fetchTrailerKey, type MediaItem } from "@/lib/tmdb";
import {
  getOrCreateGuestId,
  joinRoom,
  recordSwipe,
  checkAndCreateMatch,
  subscribeToRoom,
} from "@/lib/room";
import { supabase } from "@/lib/supabase";

export default function RoomPage() {
  const params = useParams<{ code: string }>();
  const code = params.code;

  const [room, setRoom] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [deck, setDeck] = useState<MediaItem[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null | undefined>(undefined);
  const [matchedItem, setMatchedItem] = useState<MediaItem | null>(null);
  const [waitingForGuest, setWaitingForGuest] = useState(false);

  const deckRef = useRef<MediaItem[]>([]);
  deckRef.current = deck;

  // Oda bilgisini yükle
  useEffect(() => {
    const id = getOrCreateGuestId();
    setUserId(id);

    async function load() {
      // ÖNEMLİ: joinRoom burada çağrılıyor (sadece home sayfasındaki "Odaya Katıl"
      // formunda değil). Aksi halde QR kod veya paylaşılan link ile doğrudan bu
      // sayfaya gelen misafir hiçbir zaman veritabanına "guest" olarak kaydolmuyor
      // ve host'un bekleme ekranı hiç bitmiyordu. joinRoom, çağıran kişi zaten
      // host ise veritabanında değişiklik yapmadığı için host için de güvenli.
      let data: any;
      try {
        const result = await joinRoom(code);
        data = result.room;
      } catch (e: any) {
        setError(e.message ?? "Oda bulunamadı. Kodu kontrol edin veya yeni bir oda oluşturun.");
        setLoading(false);
        return;
      }
      setRoom(data);
      setWaitingForGuest(!data.guest_id && data.host_id === id);

      try {
        const items = await fetchDeck({
          mediaType: data.media_type,
          mode: data.discovery_mode,
          minScore: data.min_score,
        });
        setDeck(items);
      } catch (e: any) {
        setError(e.message ?? "İçerik yüklenemedi. TMDB API anahtarınızı kontrol edin.");
      }
      setLoading(false);
    }

    load();
  }, [code]);

  // Oda durumu ve match dinleyicisi
  useEffect(() => {
    if (!room?.id) return;

    const roomChannel = supabase
      .channel(`room-status-${room.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "rooms", filter: `id=eq.${room.id}` },
        (payload) => {
          setRoom(payload.new);
          setWaitingForGuest(!payload.new.guest_id && payload.new.host_id === userId);
        }
      )
      .subscribe();

    const unsubscribe = subscribeToRoom(
      room.id,
      () => {}, // swipe insert bilgisini şu an kullanmıyoruz; match tetiklemesi matches tablosundan geliyor
      (payload) => {
        const match = payload.new;
        const item = deckRef.current.find(
          (d) => d.id === match.media_id && d.media_type === match.media_type
        );
        if (item) setMatchedItem(item);
      }
    );

    return () => {
      supabase.removeChannel(roomChannel);
      unsubscribe();
    };
  }, [room?.id, userId]);

  const otherUserId = room
    ? room.host_id === userId
      ? room.guest_id
      : room.host_id
    : null;

  async function handleSwipe(item: MediaItem, direction: "like" | "pass") {
    setCursor((c) => c + 1);
    if (!room || !userId) return;

    try {
      await recordSwipe({
        roomId: room.id,
        userId,
        mediaId: item.id,
        mediaType: item.media_type,
        direction,
      });

      if (direction === "like" && otherUserId) {
        const matched = await checkAndCreateMatch({
          roomId: room.id,
          userId,
          otherUserId,
          mediaId: item.id,
          mediaType: item.media_type,
        });
        if (matched) setMatchedItem(item);
      }
    } catch (e) {
      // Sessizce yut: bağlantı sorunu olsa bile kullanıcı kaydırmaya devam edebilir
      console.error(e);
    }
  }

  async function handleOpenTrailer(item: MediaItem) {
    setTrailerKey(null); // yükleniyor durumu
    const key = await fetchTrailerKey(item.media_type, item.id);
    setTrailerKey(key);
  }

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/room/${code}` : "";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    shareUrl
  )}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/60">
        Yükleniyor...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-neon-red">{error}</p>
      </div>
    );
  }

  if (waitingForGuest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-white/60">Partnerini bekliyorsun...</p>
        <div className="text-5xl font-mono tracking-[0.3em] text-white font-bold">
          {code}
        </div>
        <img src={qrUrl} alt="QR kod" className="rounded-xl bg-white p-2" />
        <p className="text-white/40 text-sm max-w-xs">
          Bu kodu veya linki WhatsApp'tan partnerine gönder. Katıldığında otomatik başlayacaksın.
        </p>
      </div>
    );
  }

  const visibleCards = deck.slice(cursor, cursor + 3);
  const deckFinished = cursor >= deck.length;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-md flex justify-between items-center mb-4 text-white/50 text-sm">
        <span>Oda: {code}</span>
        <span>{room?.media_type === "movie" ? "🎬 Film" : "📺 Dizi"}</span>
      </div>

      <div className="relative w-full max-w-md aspect-[2/3]">
        {deckFinished ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center gap-3 text-white/50">
            <p className="text-lg">Kartlar bitti!</p>
            <p className="text-sm">Daha fazla içerik için filtreleri değiştirip yeni bir oda deneyebilirsiniz.</p>
          </div>
        ) : (
          visibleCards
            .map((item, i) => (
              <SwipeCard
                key={item.id}
                item={item}
                stackPosition={i}
                onSwipe={(dir) => handleSwipe(item, dir)}
                onOpenTrailer={() => handleOpenTrailer(item)}
              />
            ))
            .reverse()
        )}
      </div>

      {trailerKey !== undefined && (
        <TrailerModal youtubeKey={trailerKey} onClose={() => setTrailerKey(undefined)} />
      )}

      {matchedItem && (
        <MatchModal
          item={matchedItem}
          onClose={() => setMatchedItem(null)}
          onKeepSwiping={() => setMatchedItem(null)}
        />
      )}
    </main>
  );
}
