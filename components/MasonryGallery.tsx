"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

const GAP_PX = 14;

function useColumnCount() {
  const [columns, setColumns] = useState(3);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setColumns(w < 640 ? 1 : w < 1024 ? 2 : 3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return columns;
}

function Tile({
  image,
  onOpen,
  revealDelay,
}: {
  image: GalleryImage;
  onOpen: () => void;
  revealDelay: number;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [revealed, setRevealed] = useState(false);

  // אנימציית כניסה מדורגת (fade + rise) כשהאריח נכנס לתצוגה - נותנת
  // לגלריה תחושה חיה ודינמית במקום שהכל "יופיע" סטטי בבת אחת.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden bg-mist text-start transition-all ease-editorial"
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(18px)",
        transitionDuration: "700ms",
        transitionDelay: `${revealDelay}ms`,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        className="protected-image block w-full h-auto transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.035]"
      />
      <span className="hover-veil" />
    </button>
  );
}

export default function MasonryGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const columnCount = useColumnCount();

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, prev, next]);

  if (images.length === 0) {
    return <p className="text-stone text-sm">התמונות בגלריה זו יתווספו בקרוב.</p>;
  }

  // חלוקה round-robin לעמודות (תמונה 1→עמודה 1, תמונה 2→עמודה 2 וכו') -
  // כל עמודה היא מחסנית פשוטה עם gap אחיד ומדויק (בלי חישוב "שורות"
  // שמעגל כלפי מעלה ומשאיר שוליים) - זה מה שיצר את הרווח המכוער בעבר.
  // הסדר המקורי עדיין נשמר כי התמונות מתחלקות ברצף בין העמודות.
  const columns: { image: GalleryImage; index: number }[][] = Array.from(
    { length: columnCount },
    () => []
  );
  images.forEach((image, i) => columns[i % columnCount].push({ image, index: i }));

  return (
    <>
      <div className="flex" style={{ gap: GAP_PX }}>
        {columns.map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col" style={{ gap: GAP_PX }}>
            {col.map(({ image, index }, rowInCol) => (
              <Tile
                key={image.id}
                image={image}
                onOpen={() => setLightboxIndex(index)}
                revealDelay={Math.min(rowInCol, 4) * 90}
              />
            ))}
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 px-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="סגירה"
            className="absolute top-6 end-6 text-bone/80 hover:text-bone text-3xl leading-none transition-colors"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="הקודם"
            className="absolute start-4 md:start-8 text-bone/70 hover:text-bone text-4xl leading-none transition-colors"
          >
            ‹
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[lightboxIndex].url}
            alt={images[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
            className="protected-image max-h-[88vh] max-w-[88vw] object-contain"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="הבא"
            className="absolute end-4 md:end-8 text-bone/70 hover:text-bone text-4xl leading-none transition-colors"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
