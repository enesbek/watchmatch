"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom, joinRoom } from "@/lib/room";
import type { DiscoveryMode, MediaType } from "@/lib/tmdb";
import clsx from "clsx";

export default function RoomSetup() {
  const router = useRouter();
  const [mediaType, setMediaType] = useState<MediaType>("movie");
  const [discoveryMode, setDiscoveryMode] = useState<DiscoveryMode>("popular");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setLoading(true);
    setError(null);
    try {
      const { room } = await createRoom({
        mediaType,
        discoveryMode,
        minScore: 6.0,
      });
      router.push(`/room/${room.code}`);
    } catch (e: any) {
      setError(e.message ?? "Oda oluşturulamadı.");
      setLoading(false);
    }
  }

  async function handleJoin() {
    if (joinCode.trim().length !== 4) {
      setError("Lütfen 4 haneli oda kodunu girin.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await joinRoom(joinCode.trim());
      router.push(`/room/${joinCode.trim()}`);
    } catch (e: any) {
      setError(e.message ?? "Odaya katılınamadı.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-neon-pink">
          WatchMatch
        </h1>
        <p className="mt-2 text-white/60">
          Bu akşam ne izlesek? Swipe edin, eşleşin, izleyin.
        </p>
      </div>

      <section className="bg-surface rounded-2xl p-5 flex flex-col gap-5 card-shadow">
        <div>
          <p className="text-sm font-medium text-white/70 mb-2">İçerik Türü</p>
          <div className="grid grid-cols-2 gap-2">
            {(["movie", "tv"] as MediaType[]).map((t) => (
              <button
                key={t}
                onClick={() => setMediaType(t)}
                className={clsx(
                  "py-3 rounded-xl font-medium transition-all",
                  mediaType === t
                    ? "bg-neon-purple text-white shadow-neon"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {t === "movie" ? "🎬 Film" : "📺 Dizi"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-white/70 mb-2">
            Bilindiklik Tercihi
          </p>
          <div className="flex flex-col gap-2">
            {(
              [
                { key: "popular", label: "🔥 Popüler Klasikler" },
                { key: "hidden_gems", label: "💎 Gizli Cevherler" },
                { key: "mixed", label: "🎲 Karışık" },
              ] as { key: DiscoveryMode; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setDiscoveryMode(opt.key)}
                className={clsx(
                  "py-3 px-4 rounded-xl text-left font-medium transition-all",
                  discoveryMode === opt.key
                    ? "bg-neon-pink/90 text-white shadow-neonPink"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={loading}
          className="mt-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-purple to-neon-pink shadow-neon disabled:opacity-50"
        >
          {loading ? "Oluşturuluyor..." : "Yeni Oda Oluştur"}
        </button>
      </section>

      <div className="flex items-center gap-3 text-white/30 text-sm">
        <div className="h-px flex-1 bg-white/10" />
        veya odaya katıl
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <section className="bg-surface rounded-2xl p-5 flex flex-col gap-3 card-shadow">
        <input
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="4 haneli oda kodu"
          inputMode="numeric"
          className="bg-white/5 rounded-xl px-4 py-3.5 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-neon-purple"
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          className="py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15 disabled:opacity-50"
        >
          Odaya Katıl
        </button>
      </section>

      {error && (
        <p className="text-center text-neon-red text-sm -mt-2">{error}</p>
      )}
    </div>
  );
}
