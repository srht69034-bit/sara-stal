"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import type { ContentMap } from "@/lib/content";

const FIELDS: { key: string; label: string; hint: string }[] = [
  { key: "hero_image_url", label: "תמונת הבאנר הראשי (Hero)", hint: "מומלץ תמונה רחבה (נוף/אופקית), באיכות גבוהה" },
  { key: "about_image_url", label: "תמונת ה'אודות'", hint: "מומלץ תמונה לאורך (פורטרט)" },
  { key: "preview_outdoor_image_url", label: "תמונת קישור - חוץ", hint: "מוצגת כאריח רחב בעמוד הבית" },
  { key: "preview_chalakah_image_url", label: "תמונת קישור - חאלקה", hint: "מוצגת כאריח מרובע בעמוד הבית" },
  { key: "preview_studio_image_url", label: "תמונת קישור - סטודיו", hint: "מוצגת כאריח מרובע בעמוד הבית" },
  { key: "preview_newborn_image_url", label: "תמונת קישור - ניובורן", hint: "מוצגת כאריח לאורך בעמוד הבית" },
  { key: "preview_smashcake_image_url", label: "תמונת קישור - סמאש קייק", hint: "מוצגת כאריח רחב בעמוד הבית" },
  { key: "logo_image_url", label: "לוגו (תמונה, מחליף את הטקסט בתפריט)", hint: "מומלץ PNG עם רקע שקוף, גובה קטן" },
];

// כל שדה תמונה שומר גם מפתח _path תואם (למשל hero_image_url -> hero_image_path)
// כדי שנוכל למחוק את הקובץ הישן מה-Storage בכל פעם שמעלים תמונה חדשה,
// ולא להשאיר קבצים יתומים באחסון.
const pathKey = (key: string) => key.replace("_url", "_path");

export default function SiteImageEditor({ initialContent }: { initialContent: ContentMap }) {
  const [values, setValues] = useState<ContentMap>(initialContent);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const supabase = createClient();

  async function handleUpload(key: string, e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    setUploadingKey(key);

    let file: File = rawFile;
    try {
      file = await imageCompression(rawFile, {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2200,
        useWebWorker: true,
        fileType: "image/jpeg",
      });
    } catch {
      // ממשיכים עם הקובץ המקורי אם הדחיסה נכשלת
    }

    const path = `site/${key}-${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (!uploadError) {
      const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);

      // מוחקים את הקובץ הישן מה-Storage (אם קיים) לפני עדכון הרשומה
      const oldPath = values[pathKey(key)];
      if (oldPath) {
        await supabase.storage.from("gallery").remove([oldPath]);
      }

      await supabase.from("site_content").upsert([
        { key, value: publicUrl.publicUrl },
        { key: pathKey(key), value: path },
      ]);
      setValues({ ...values, [key]: publicUrl.publicUrl, [pathKey(key)]: path });
    }

    setUploadingKey(null);
  }

  return (
    <div className="grid sm:grid-cols-2 gap-8">
      {FIELDS.map((f) => (
        <div key={f.key} className="flex flex-col gap-3">
          <p className="text-sm text-stone">{f.label}</p>
          <div className="aspect-[4/3] bg-mist overflow-hidden">
            {values[f.key] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values[f.key]} alt={f.label} className="h-full w-full object-cover" />
            )}
          </div>
          <p className="text-xs text-stone">{f.hint}</p>
          <label className="inline-block w-fit text-xs border border-ink px-4 py-2.5 cursor-pointer hover:bg-ink hover:text-bone transition-colors">
            {uploadingKey === f.key ? "מעלה..." : "החלפת תמונה"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingKey === f.key}
              onChange={(e) => handleUpload(f.key, e)}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
