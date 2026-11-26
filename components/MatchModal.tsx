"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { fetchWatchProviders, posterUrl, type MediaItem, type WatchProvider } from "@/lib/tmdb";
import { useI18n } from "@/lib/i18n";

interface Props {
  item: MediaItem;
  onClose: () => void;
  onKeepSwiping: () => void;
}

export default function MatchModal({ item, onClose, onKeepSwiping }: Props) {
  const { t } = useI18n();
  const [providers, setProviders] = useState<WatchProvider[]>([]);
  const [link, setLink] = useState<string | undefined>();

  useEffect(() => {
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ["#B026FF", "#FF2E9F", "#FF2E4D", "#ffffff"],
    });
    fetchWatchProviders(item.media_type, item.id).then((res) => {
      setProviders(res.providers);
      setLink(res.link);
    });
  }, [item]);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 animate-popIn">
      <p className="text-neon-pink font-extrabold text-lg tracking-widest mb-1">
        {t("match.title")}
      </p>
      <h2 className="text-white text-3xl font-bold text-center mb-6">
        {t("match.bothSaid", { title: item.title })}
      </h2>

      <img
        src={posterUrl(item.poster_path)}
        alt={item.title}
        className="w-40 rounded-xl card-shadow mb-6"
      />

      <div className="w-full max-w-sm">
        <p className="text-white/50 text-sm mb-2 text-center">
          {t("match.availableOn")}
        </p>
        {providers.length > 0 ? (
          <div className="flex justify-center gap-3 mb-6 flex-wrap">
            {providers.map((p) => (
              <img
                key={p.provider_name}
                src={posterUrl(p.logo_path, "w342")}
                alt={p.provider_name}
                title={p.provider_name}
                className="w-12 h-12 rounded-xl"
              />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm text-center mb-6">
            {t("match.noProviders")}
          </p>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="block text-center py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-neon-purple to-neon-pink shadow-neon mb-3"
          >
            {t("match.watchNow")}
          </a>
        )}
        <button
          onClick={onKeepSwiping}
          className="w-full py-3.5 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/15"
        >
          {t("match.keepSwiping")}
        </button>
      </div>
    </div>
  );
}
