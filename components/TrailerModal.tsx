"use client";

import { useI18n } from "@/lib/i18n";

interface Props {
  youtubeKey: string | null;
  onClose: () => void;
}

export default function TrailerModal({ youtubeKey, onClose }: Props) {
  const { t } = useI18n();
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg aspect-video bg-surface rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {youtubeKey ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1`}
            title={t("trailer.title")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            {t("trailer.notFound")}
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
        aria-label={t("trailer.close")}
      >
        ✕
      </button>
    </div>
  );
}
