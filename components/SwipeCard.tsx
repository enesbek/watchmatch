"use client";

import { motion, useAnimation, PanInfo } from "framer-motion";
import { useState } from "react";
import { posterUrl, type MediaItem } from "@/lib/tmdb";

interface Props {
  item: MediaItem;
  onSwipe: (direction: "like" | "pass") => void;
  onOpenTrailer: () => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({ item, onSwipe, onOpenTrailer, isTop }: Props) {
  const controls = useAnimation();
  const [dragDir, setDragDir] = useState<"like" | "pass" | null>(null);

  function handleDrag(_: any, info: PanInfo) {
    if (info.offset.x > 40) setDragDir("like");
    else if (info.offset.x < -40) setDragDir("pass");
    else setDragDir(null);
  }

  async function handleDragEnd(_: any, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      await controls.start({ x: 500, rotate: 20, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("like");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      await controls.start({ x: -500, rotate: -20, opacity: 0, transition: { duration: 0.3 } });
      onSwipe("pass");
    } else {
      controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 25 } });
      setDragDir(null);
    }
  }

  async function programmaticSwipe(direction: "like" | "pass") {
    await controls.start({
      x: direction === "like" ? 500 : -500,
      rotate: direction === "like" ? 20 : -20,
      opacity: 0,
      transition: { duration: 0.3 },
    });
    onSwipe(direction);
  }

  const year = item.release_date ? item.release_date.slice(0, 4) : "—";

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: isTop ? 10 : 5 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10, opacity: isTop ? 1 : 0.6 }}
    >
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden card-shadow bg-surface select-none"
        onClick={onOpenTrailer}
      >
        <img
          src={posterUrl(item.poster_path)}
          alt={item.title}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute inset-0 gradient-overlay" />

        {dragDir === "like" && (
          <div className="absolute top-8 left-6 border-4 border-green-400 text-green-400 font-extrabold text-2xl px-4 py-1 rounded-lg rotate-[-15deg]">
            BEĞENDİM
          </div>
        )}
        {dragDir === "pass" && (
          <div className="absolute top-8 right-6 border-4 border-neon-red text-neon-red font-extrabold text-2xl px-4 py-1 rounded-lg rotate-[15deg]">
            PAS
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-yellow-400/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
              ⭐ {item.vote_average.toFixed(1)}
            </span>
            <span className="text-white/70 text-sm">{year}</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight">{item.title}</h2>
          <p className="text-white/70 text-sm mt-1.5 line-clamp-2">
            {item.overview || "Özet bulunamadı."}
          </p>
          <p className="text-white/40 text-xs mt-2">Fragman için karta dokun</p>
        </div>
      </div>

      {isTop && (
        <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-8">
          <button
            onClick={(e) => {
              e.stopPropagation();
              programmaticSwipe("pass");
            }}
            className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center text-3xl shadow-lg active:scale-90 transition-transform"
            aria-label="Pas geç"
          >
            ❌
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              programmaticSwipe("like");
            }}
            className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center text-3xl shadow-lg active:scale-90 transition-transform"
            aria-label="Beğen"
          >
            💚
          </button>
        </div>
      )}
    </motion.div>
  );
}
