"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContentMap } from "@/lib/content";

const FIELD_LABELS: Record<string, string> = {
  hero_title: "כותרת ראשית (Hero)",
  hero_subtitle: "כותרת משנה (Hero)",
  galleries_title: "כותרת - סקשן גלריות",
  about_title: "כותרת - אודות",
  about_body: "טקסט - אודות",
  testimonial_quote: "ציטוט לקוחה",
  testimonial_author: "שם/תיאור הלקוחה (מתחת לציטוט)",
  gallery_chalakah_label: "תווית גלריה - חאלקה",
  gallery_newborn_label: "תווית גלריה - ניובורן",
  gallery_smashcake_label: "תווית גלריה - סמאש קייק",
  gallery_outdoor_label: "תווית גלריה - חוץ",
  gallery_studio_label: "תווית גלריה - סטודיו",
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

  async function saveField(key: string) {
    setSaving(key);
    const supabase = createClient();
    // upsert - דורש שהמשתמש מחובר (RLS: authenticated only), ראו supabase/schema.sql
    await supabase.from("site_content").upsert({ key, value: values[key] });
    setSaving(null);
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
                {saving === key ? "שומר..." : "שמירה"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
