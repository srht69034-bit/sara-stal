"use client";

import { useCallback, useEffect, useState } from "react";
import type { AlbumImage } from "@/lib/albums";

export default function AlbumViewer({ images }: { images: AlbumImage[] }) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (images.length === 0) {
    return <p className="text-bone/60 py-24 text-center">התמונות באלבום זה יתווספו בקרוב.</p>;
  }

  return (
    <div>
      <div className="relative aspect-[3/2] md:aspect-[16/9] bg-bone/5 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={images[index].id}
          src={images[index].url}
          alt={images[index].alt}
          className="protected-image h-full w-full object-contain animate-[fadeIn_.4s_ease-out]"
        />

        <button
          type="button"
          onClick={prev}
          aria-label="הקודם"
          className="absolute start-3 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone text-4xl leading-none transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="הבא"
          className="absolute end-3 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone text-4xl leading-none transition-colors"
        >
          ›
        </button>

        <span className="eyebrow absolute bottom-4 start-4 text-bone/60">
          {index + 1} / {images.length}
        </span>
      </div>

      <div className="flex gap-2.5 mt-6 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setIndex(i)}
            className={`shrink-0 w-20 h-20 overflow-hidden transition-opacity ${
              i === index ? "opacity-100 ring-1 ring-olive" : "opacity-50 hover:opacity-80"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
