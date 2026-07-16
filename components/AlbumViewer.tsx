"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
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
    // בדסקטופ: פס התמונות הממוזערות בצד (לא מתחת) - flex-row-reverse כדי
    // שיישב מימין בעמוד RTL. במובייל חוזר לפריסה אנכית (תמונה למעלה, פס למטה).
    <div className="flex flex-col md:flex-row-reverse gap-4">
      <div className="relative flex-1 aspect-[3/2] md:aspect-[16/10] bg-bone/5 overflow-hidden">
        <Image
          key={images[index].id}
          src={images[index].url}
          alt={images[index].alt}
          fill
          sizes="(max-width: 1024px) 100vw, 1200px"
          priority
          className="protected-image object-contain animate-[fadeIn_.4s_ease-out]"
        />

        {/* חצים בולטים יותר - עיגול עם רקע כהה למראה ברור, לא רק טקסט דהוי */}
        <button
          type="button"
          onClick={prev}
          aria-label="הקודם"
          className="absolute start-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink/50 hover:bg-ink/75 text-bone flex items-center justify-center text-2xl leading-none transition-colors"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="הבא"
          className="absolute end-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink/50 hover:bg-ink/75 text-bone flex items-center justify-center text-2xl leading-none transition-colors"
        >
          ›
        </button>

        <span className="eyebrow absolute bottom-4 start-4 text-bone/70">
          {index + 1} / {images.length}
        </span>
      </div>

      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[520px] pb-2 md:pb-0 md:w-24">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setIndex(i)}
            className={`relative shrink-0 w-20 h-20 overflow-hidden transition-opacity ${
              i === index ? "opacity-100 ring-1 ring-olive" : "opacity-50 hover:opacity-80"
            }`}
          >
            <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
