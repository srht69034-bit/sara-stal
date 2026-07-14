"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/testimonials";

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <blockquote key={current.id} className="animate-[fadeIn_.6s_ease-out]">
        <p className="font-display italic text-2xl md:text-3xl leading-snug text-ink">
          “{current.quote}”
        </p>
        <footer className="eyebrow mt-6 not-italic">{current.author}</footer>
      </blockquote>

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
