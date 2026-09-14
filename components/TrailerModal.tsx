"use client";

interface Props {
  youtubeKey: string | null;
  onClose: () => void;
}

export default function TrailerModal({ youtubeKey, onClose }: Props) {
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
            title="Fragman"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            Bu içerik için fragman bulunamadı.
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white text-3xl"
        aria-label="Kapat"
      >
        ✕
      </button>
    </div>
  );
}
