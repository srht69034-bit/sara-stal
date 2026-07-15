"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContentMap } from "@/lib/content";

const FIELD_LABELS: Record<string, string> = {
  site_name: "שם האתר (בתפריט, אם אין לוגו תמונה)",
  hero_title: "כותרת ראשית (Hero)",
  hero_subtitle: "כותרת משנה (Hero)",
  galleries_title: "כותרת - סקשן גלריות",
  about_title: "כותרת - אודות",
  about_body: "טקסט - אודות",
  albums_teaser_title: "כותרת - סקשן אלבומים בעמוד הבית",
  albums_teaser_body: "טקסט - סקשן אלבומים בעמוד הבית",
  steps_title: "כותרת - סקשן שלבי הזמנה",
  steps_1_title: "שלב 1 - כותרת",
  steps_1_body: "שלב 1 - טקסט",
  steps_2_title: "שלב 2 - כותרת",
  steps_2_body: "שלב 2 - טקסט",
  steps_3_title: "שלב 3 - כותרת",
  steps_3_body: "שלב 3 - טקסט",
  steps_4_title: "שלב 4 - כותרת",
  steps_4_body: "שלב 4 - טקסט",
  gallery_chalakah_label: "שם גלריה - חאלקה",
  gallery_newborn_label: "שם גלריה - ניובורן",
  gallery_smashcake_label: "שם גלריה - סמאש קייק",
  gallery_outdoor_label: "שם גלריה - חוץ",
  gallery_studio_label: "שם גלריה - סטודיו",
  preview_chalakah_caption: "טקסט מתחת - חאלקה (בעמוד הבית)",
  preview_newborn_caption: "טקסט מתחת - ניובורן (בעמוד הבית)",
  preview_smashcake_caption: "טקסט מתחת - סמאש קייק (בעמוד הבית)",
  preview_outdoor_caption: "טקסט מתחת - חוץ (בעמוד הבית)",
  preview_studio_caption: "טקסט מתחת - סטודיו (בעמוד הבית)",
  contact_title: "כותרת - יצירת קשר",
  contact_body: "טקסט - יצירת קשר",
  footer_phone: "טלפון (פוטר)",
  footer_email: "אימייל (פוטר)",
  footer_credit: "קרדיט (פוטר)",
  footer_instagram: "קישור לאינסטגרם (פוטר, אופציונלי)",
};

export default function ContentEditor({ initialContent }: { initialContent: ContentMap }) {
  const [values, setValues] = useState<ContentMap>(initialContent);
  const [saving, setSaving] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<string | null>(null);

  async function saveField(key: string) {
    setSaving(key);
    setErrors((e) => ({ ...e, [key]: "" }));
    const supabase = createClient();
    // upsert - דורש שהמשתמש מחובר (RLS: authenticated only), ראו supabase/schema.sql
    const { error } = await supabase.from("site_content").upsert({ key, value: values[key] });
    setSaving(null);
    if (error) {
      setErrors((e) => ({ ...e, [key]: error.message }));
    } else {
      setSaved(key);
      setTimeout(() => setSaved((s) => (s === key ? null : s)), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(FIELD_LABELS).map(([key, label]) => {
        const isLong = key.endsWith("_body");
        return (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm text-stone">{label}</label>
            <div className="flex gap-3 items-start">
              {isLong ? (
                <textarea
                  rows={3}
                  value={values[key] ?? ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  className="flex-1 border border-mist bg-transparent p-3 outline-none focus:border-ink"
                />
              ) : (
                <input
                  value={values[key] ?? ""}
                  onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                  className="flex-1 border border-mist bg-transparent p-3 outline-none focus:border-ink"
                />
              )}
              <button
                onClick={() => saveField(key)}
                disabled={saving === key}
                className="text-xs border border-ink px-4 py-3 hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
              >
                {saving === key ? "שומר..." : saved === key ? "נשמר ✓" : "שמירה"}
              </button>
            </div>
            {errors[key] && <p className="text-xs text-rust">שגיאה בשמירה: {errors[key]}</p>}
          </div>
        );
      })}
    </div>
  );
}
