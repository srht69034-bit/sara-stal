"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
};

// גובה יחידת השורה (px) שמשמשת לחישוב כמה "שורות" כל תמונה תופסת -
// ככל שהיחידה קטנה יותר, הפריסה מדויקת יותר לגובה האמיתי של התמונה.
const ROW_UNIT = 8;
const GAP = 14;

function Tile({
  image,
  onOpen,
}: {
  image: GalleryImage;
  onOpen: () => void;
}) {
  const wrapRef = useRef<HTMLButtonElement>(null);
  const [span, setSpan] = useState(40);

  // מודדים לפי המימדים האמיתיים (naturalWidth/naturalHeight) של הקובץ
  // ולא לפי הגובה המוצג כרגע - כך תמונה לאורך נשארת לאורך, ותמונה
  // לרוחב נשארת לרוחב, בלי חיתוך מלאכותי (בלי object-cover).
  const measure = useCallback((img: HTMLImageElement) => {
    const wrap = wrapRef.current;
    if (!wrap || !img.naturalWidth) return;
    const width = wrap.getBoundingClientRect().width;
    const renderedHeight = width * (img.naturalHeight / img.naturalWidth);
    setSpan(Math.ceil((renderedHeight + GAP) / (ROW_UNIT + GAP)));
  }, []);

  const onLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => measure(e.currentTarget),
    [measure]
  );

  useEffect(() => {
    const onResize = () => {
      const img = wrapRef.current?.querySelector("img");
      if (img && img.complete) measure(img);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  return (
    <button
      ref={wrapRef}
      type="button"
      onClick={onOpen}
      className="group relative block w-full overflow-hidden bg-mist text-start"
      style={{ gridRowEnd: `span ${span}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.alt}
        loading="lazy"
        onLoad={onLoad}
        className="protected-image block w-full h-auto transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.02]"
      />
      <span className="hover-veil" />
    </button>
  );
}

export default function MasonryGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  return (
    <>
      {/*
        גריד Masonry אמיתי מבוסס-שורות, בדיוק 3 עמודות בדסקטופ (לא
        auto-fill שיכול לייצר יותר על מסכים רחבים) - כל תמונה תופסת
        מספר "שורות" יחסי לגובה האמיתי שלה, כך שהיחס המקורי נשמר
        במדויק, והזרימה עדיין לפי רוחב העמוד ולא לאורכו.
      */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
        style={{ gridAutoRows: `${ROW_UNIT}px` }}
      >
        {images.map((img, i) => (
          <Tile key={img.id} image={img} onOpen={() => setLightboxIndex(i)} />
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
