"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { safeFileName } from "@/lib/sanitize";

const CATEGORIES = [
  { slug: "chalakah", label: "חאלקה" },
  { slug: "newborn", label: "ניובורן" },
  { slug: "smash-cake", label: "סמאש קייק" },
  { slug: "outdoor", label: "חוץ" },
  { slug: "studio", label: "סטודיו" },
];

type ImageRow = { id: string; url: string; path: string; alt: string };

async function compress(rawFile: File): Promise<File> {
  try {
    return await imageCompression(rawFile, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
      fileType: "image/jpeg",
    });
  } catch {
    return rawFile;
  }
}

/**
 * כל הגלריות מוצגות במקביל (לא tab יחיד) - כך שאפשר להעלות תמונות
 * לכמה גלריות שונות בלי לעבור ביניהן, וכל אחת מציגה כמה תמונות יש
 * בה כרגע וכמה עוד נשארו להעלות בזמן העלאה מרובה.
 */
export default function ImageManager() {
  return (
    <div className="flex flex-col gap-10">
      {CATEGORIES.map((c) => (
        <CategoryBlock key={c.slug} slug={c.slug} label={c.label} />
      ))}
    </div>
  );
}

function CategoryBlock({ slug, label }: { slug: string; label: string }) {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [uploaded, setUploaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [bannerUploading, setBannerUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data, error: loadError } = await supabase
      .from("gallery_images")
      .select("id, url, path, alt")
      .eq("category", slug)
      .order("created_at", { ascending: false });
    if (loadError) {
      setError(`שגיאה בטעינת תמונות: ${loadError.message}`);
    } else {
      setImages((data as ImageRow[]) ?? []);
    }

    const { data: banner } = await supabase
      .from("site_content")
      .select("value")
      .eq("key", `gallery_banner_${slug}_url`)
      .maybeSingle();
    setBannerUrl(banner?.value ?? "");
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setTotal(files.length);
    setUploaded(0);
    setError(null);
    const failures: string[] = [];

    for (const rawFile of files) {
      const file = await compress(rawFile);
      // שם קובץ בטוח (ASCII) - שם מקורי בעברית/עם רווחים היה גורם לשגיאת העלאה
      const path = `${slug}/${safeFileName(rawFile.name)}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (uploadError) {
        failures.push(`${rawFile.name}: ${uploadError.message}`);
      } else {
        const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);
        const { error: insertError } = await supabase.from("gallery_images").insert({
          category: slug,
          path,
          url: publicUrl.publicUrl,
          alt: rawFile.name,
        });
        if (insertError) failures.push(`${rawFile.name}: ${insertError.message}`);
      }
      setUploaded((n) => n + 1);
    }

    setTotal(0);
    if (failures.length > 0) setError(`נכשלו ${failures.length} תמונות: ${failures.join(" · ")}`);
    await load();
  }

  async function handleDelete(image: ImageRow) {
    const res = await fetch("/api/admin/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id, path: image.path }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(`שגיאה במחיקת תמונה: ${body.error ?? res.statusText}`);
      return;
    }
    setError(null);
    await load();
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setBannerUploading(true);
    setError(null);
    const file = await compress(rawFile);
    const path = `banners/${slug}-${safeFileName(rawFile.name)}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (uploadError) {
      setError(`שגיאה בהעלאת באנר: ${uploadError.message}`);
    } else {
      const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);

      // מוחקים את באנר הגלריה הקודם מה-Storage לפני עדכון הרשומה
      const { data: oldPathRow } = await supabase
        .from("site_content")
        .select("value")
        .eq("key", `gallery_banner_${slug}_path`)
        .maybeSingle();
      if (oldPathRow?.value) {
        await supabase.storage.from("gallery").remove([oldPathRow.value]);
      }

      const { error: saveError } = await supabase.from("site_content").upsert([
        { key: `gallery_banner_${slug}_url`, value: publicUrl.publicUrl },
        { key: `gallery_banner_${slug}_path`, value: path },
      ]);
      if (saveError) {
        setError(`שגיאה בשמירת באנר: ${saveError.message}`);
      } else {
        setBannerUrl(publicUrl.publicUrl);
      }
    }
    setBannerUploading(false);
  }

  return (
    <div className="border border-mist p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg">{label}</h3>
        <span className="text-xs text-stone">{images.length} תמונות</span>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-5">
        <label className="text-xs border border-ink px-4 py-2.5 cursor-pointer hover:bg-ink hover:text-bone transition-colors">
          העלאת תמונות (ניתן לבחור כמה יחד)
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
        {total > 0 && (
          <span className="text-xs text-stone">
            הועלו {uploaded} מתוך {total}
          </span>
        )}

        <div className="w-px h-6 bg-mist" />

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-mist overflow-hidden shrink-0">
            {bannerUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bannerUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <label className="text-xs border border-mist px-3 py-2 cursor-pointer hover:border-ink transition-colors">
            {bannerUploading ? "מעלה..." : "באנר עמוד הגלריה"}
            <input type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
          </label>
        </div>
      </div>

      {error && <p className="text-xs text-rust mb-4">{error}</p>}

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square bg-mist overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(img)}
              className="absolute inset-0 bg-ink/60 text-bone text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              מחיקה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
