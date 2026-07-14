"use client";

/**
 * תנועה עדינה ואיטית על תמונת ה-Hero (סוג "Ken Burns" - זום איטי
 * לאורך כ-20 שניות) - נותנת תחושת חיים לבאנר בלי להיות מהבהבת
 * או מסיחת דעת.
 */
export default function HeroImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="protected-image absolute inset-0 h-full w-full object-cover animate-hero-pan" />
    </>
  );
}
