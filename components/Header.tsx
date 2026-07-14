"use client";

import { useState } from "react";
import Link from "next/link";

const GALLERIES = [
  { slug: "chalakah", label: "חאלקה" },
  { slug: "newborn", label: "ניובורן" },
  { slug: "smash-cake", label: "סמאש קייק" },
  { slug: "outdoor", label: "חוץ" },
  { slug: "studio", label: "סטודיו" },
];

export default function Header({
  siteName,
  logoUrl,
}: {
  siteName: string;
  logoUrl?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-bone/90 backdrop-blur-sm border-b border-mist">
      <div className="mx-auto max-w-editorial px-8 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
          ) : (
            <span className="font-display text-xl tracking-wide">{siteName}</span>
          )}
        </Link>

        <nav className="flex items-center gap-10 text-sm">
          {/*
            ה"גשר" הבא (pt-3 בתוך אלמנט שמתחיל מיד ב-top-full, בלי מרווח
            חיצוני) מבטיח שהעכבר לא "יוצא" מאזור ה-hover בזמן המעבר בין
            הכפתור לתפריט - זה מה שגרם לתפריט להיסגר לפני שהספיקו ללחוץ.
          */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              className="eyebrow relative flex items-center gap-1.5 py-2 hover:text-olive transition-colors duration-300 group"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
            >
              גלריות
              <span
                className="inline-block transition-transform duration-300 ease-editorial text-[10px]"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ⌄
              </span>
              <span className="absolute -bottom-0.5 right-0 h-px w-0 bg-olive transition-all duration-300 ease-editorial group-hover:w-full" />
            </button>

            {open && (
              <div className="absolute end-0 top-full w-56 pt-3">
                <div className="bg-bone border border-mist shadow-[0_12px_28px_-12px_rgba(61,58,54,0.18)] animate-[fadeIn_.2s_ease-out]">
                  {GALLERIES.map((g) => (
                    <Link
                      key={g.slug}
                      href={`/gallery/${g.slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-sm hover:bg-mist/40 hover:text-olive transition-colors duration-200"
                    >
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/albums" className="eyebrow relative py-2 hover:text-olive transition-colors duration-300 group">
            אלבומים
            <span className="absolute -bottom-0.5 right-0 h-px w-0 bg-olive transition-all duration-300 ease-editorial group-hover:w-full" />
          </Link>

          <Link href="/#about" className="eyebrow relative py-2 hover:text-olive transition-colors duration-300 group">
            עלי
            <span className="absolute -bottom-0.5 right-0 h-px w-0 bg-olive transition-all duration-300 ease-editorial group-hover:w-full" />
          </Link>

          <Link
            href="/#contact"
            className="eyebrow border border-olive px-5 py-2.5 hover:bg-olive hover:text-bone transition-colors duration-300"
          >
            יצירת קשר
          </Link>
        </nav>
      </div>
    </header>
  );
}
