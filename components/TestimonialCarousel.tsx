"use client";

import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [items.length, next]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    // הכל בזרימה רגילה (בלי absolute) - זה מה שגרם לנקודות הדפדוף
    // "לצוף" מעל הטקסט קודם: הן היו ממוקמות absolute בלי הורה עם
    // position:relative קרוב מספיק, אז הן נחתו במקום הלא נכון.
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex items-center justify-center gap-4">
        {items.length > 1 && (
          <button
            onClick={prev}
            aria-label="ההמלצה הקודמת"
            className="shrink-0 w-7 h-7 rounded-full border border-mist text-stone hover:border-olive hover:text-olive transition-colors flex items-center justify-center text-sm"
          >
            ‹
          </button>
        )}

        <div className="min-h-[180px] md:min-h-[160px] flex items-center justify-center flex-1">
          <blockquote key={current.id} className="animate-[fadeIn_.6s_ease-out]">
            <p className="font-display text-xl md:text-2xl leading-snug text-ink/90 whitespace-pre-line">
              “{current.quote}”
            </p>
            <footer className="eyebrow mt-6">{current.author}</footer>
          </blockquote>
        </div>

        {items.length > 1 && (
          <button
            onClick={next}
            aria-label="ההמלצה הבאה"
            className="shrink-0 w-7 h-7 rounded-full border border-mist text-stone hover:border-olive hover:text-olive transition-colors flex items-center justify-center text-sm"
          >
            ›
          </button>
        )}
      </div>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {items.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setIndex(i)}
              aria-label={`המלצה ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-olive" : "w-1.5 bg-mist"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
