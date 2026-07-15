"use client";

import { useState } from "react";
import Link from "next/link";
import { GALLERY_SLUGS, type GallerySlug } from "@/lib/galleries";

const FALLBACK_LABELS: Record<GallerySlug, string> = {
  chalakah: "חאלקה",
  newborn: "ניובורן",
  "smash-cake": "סמאש קייק",
  outdoor: "חוץ",
  studio: "סטודיו",
};

export default function Header({
  siteName,
  logoUrl,
  galleryLabels,
}: {
  siteName: string;
  logoUrl?: string;
  galleryLabels?: Record<GallerySlug, string>;
}) {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const labels = galleryLabels ?? FALLBACK_LABELS;

  return (
    <header className="sticky top-0 z-50 bg-bone/90 backdrop-blur-sm border-b border-mist">
      <div className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-9 w-auto object-contain" />
          ) : (
            <span className="font-display text-lg tracking-wide text-ink">{siteName}</span>
          )}
        </Link>

        {/* ניווט דסקטופ - שקט ומינימלי, בלי כפתור מודגש ובלי אנימציית קו רועשת */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
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
              className="eyebrow flex items-center gap-1.5 py-2 hover:text-olive transition-colors duration-300"
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
            </button>

            {open && (
              <div className="absolute end-0 top-full w-56 pt-3">
                <div className="bg-bone border border-mist shadow-[0_12px_28px_-12px_rgba(61,58,54,0.18)] animate-[fadeIn_.2s_ease-out]">
                  {GALLERY_SLUGS.map((slug) => (
                    <Link
                      key={slug}
                      href={`/gallery/${slug}`}
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-sm text-ink hover:bg-mist/40 hover:text-olive transition-colors duration-200"
                    >
                      {labels[slug]}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/albums" className="eyebrow py-2 hover:text-olive transition-colors duration-300">
            אלבומים
          </Link>
          <Link href="/#about" className="eyebrow py-2 hover:text-olive transition-colors duration-300">
            עלי
          </Link>
          <Link href="/#contact" className="eyebrow py-2 hover:text-olive transition-colors duration-300">
            יצירת קשר
          </Link>
        </nav>

        {/* כפתור המבורגר - מובייל/טאבלט בלבד */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="תפריט"
          aria-expanded={mobileOpen}
        >
          <span className={`block h-px w-5 bg-ink transition-transform ${mobileOpen ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-ink transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-ink transition-transform ${mobileOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
        </button>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-mist bg-bone px-6 py-6 flex flex-col gap-5 animate-[fadeIn_.2s_ease-out]">
          <p className="eyebrow text-stone">גלריות</p>
          <div className="flex flex-col gap-4 ps-3">
            {GALLERY_SLUGS.map((slug) => (
              <Link key={slug} href={`/gallery/${slug}`} onClick={() => setMobileOpen(false)} className="text-sm text-ink">
                {labels[slug]}
              </Link>
            ))}
          </div>
          <Link href="/albums" onClick={() => setMobileOpen(false)} className="eyebrow">
            אלבומים
          </Link>
          <Link href="/#about" onClick={() => setMobileOpen(false)} className="eyebrow">
            עלי
          </Link>
          <Link href="/#contact" onClick={() => setMobileOpen(false)} className="eyebrow">
            יצירת קשר
          </Link>
        </nav>
      )}
    </header>
  );
}
