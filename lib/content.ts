import { createClient } from "@/lib/supabase/server";

/**
 * טקסטים ברירת מחדל (placeholder) - מוצגים כל עוד לא הוזן תוכן אמיתי
 * דרך דשבורד הניהול. כל מפתח (key) הוא שדה טקסט שניתן לעריכה.
 * ברגע שיש שורה מתאימה בטבלת site_content, היא גוברת על ברירת המחדל.
 */
export const DEFAULT_CONTENT: Record<string, string> = {
  hero_title: "האור מספר את הסיפור",
  hero_subtitle: "צילום משפחות, ילדים ורגעים שלא חוזרים",
  galleries_title: "מתוך העדשה",
  about_title: "על המלאכה והסיפור שמאחורי",
  about_body:
    "כאן ייכתב הסיפור האישי שלך - איך התחלת, מה מניע אותך, ולמה אנשים בוחרים אותך לתעד את הרגעים החשובים בחייהם. אפשר לערוך את הטקסט הזה בכל רגע מהדשבורד.",
  testimonial_quote:
    "היא לא רק צילמה אותנו - היא תפסה בדיוק איך זה מרגיש להיות המשפחה שלנו.",
  testimonial_author: "מתוך תגובת לקוחה",
  gallery_chalakah_label: "חאלקה",
  gallery_newborn_label: "ניובורן",
  gallery_smashcake_label: "סמאש קייק",
  gallery_outdoor_label: "חוץ",
  gallery_studio_label: "סטודיו",
  contact_title: "בואו נדבר על המפגש הבא",
  contact_body: "מספרים לי קצת על הרגע שתרצו לתעד, וחוזרים אליכם בהקדם.",
  footer_phone: "055-674-9840",
  footer_email: "אימייל: —",
  footer_credit: "עיצוב ופיתוח האתר",
  footer_instagram: "",
  // תמונות עיצוב - ניתנות להחלפה מהדשבורד (SiteImageEditor); עד אז מוצגות תמונות placeholder
  hero_image_url: "https://picsum.photos/seed/hero-photography-wide/1800/1100",
  about_image_url: "https://picsum.photos/seed/photographer-portrait/900/1100",
  preview_outdoor_image_url: "https://picsum.photos/seed/outdoor-field/900/620",
  preview_chalakah_image_url: "https://picsum.photos/seed/chalakah-ceremony/900/620",
  preview_studio_image_url: "https://picsum.photos/seed/studio-light/900/620",
  preview_newborn_image_url: "https://picsum.photos/seed/newborn-soft/900/620",
  preview_smashcake_image_url: "https://picsum.photos/seed/smash-cake-birthday/900/620",
  logo_image_url: "",
  site_name: "Sara Stal",
  preview_outdoor_caption: "בין עצים ואור טבעי",
  preview_chalakah_caption: "רגע שנחגג במעגל",
  preview_studio_caption: "רוגע ואור מבוים",
  preview_newborn_caption: "הימים הראשונים שלכם",
  preview_smashcake_caption: "שנה ראשונה למתוקים",
  steps_title: "איך זה עובד",
  steps_1_title: "יצירת קשר",
  steps_1_body: "מספרים לי קצת על הרגע שתרצו לתעד ועל הסגנון שאהוב עליכם.",
  steps_2_title: "תיאום פגישה",
  steps_2_body: "קובעים תאריך, מיקום ושעה שנוחים לכם, כולל שיחת הכרות קצרה.",
  steps_3_title: "יום הצילומים",
  steps_3_body: "אני מגיעה עם כל הציוד, ומלווה אתכם ברוגע לאורך כל הצילום.",
  steps_4_title: "קבלת התמונות",
  steps_4_body: "עורכת ומעבירה לכם גלריה דיגיטלית מלאה תוך זמן קצר.",
  albums_teaser_title: "אלבומי לקוחות",
  albums_teaser_body: "כל סיפור מקבל אלבום משלו - דפדפו בין הרגעים שתועדו במלואם.",
  gallery_banner_chalakah_url: "https://picsum.photos/seed/banner-chalakah/1800/700",
  gallery_banner_newborn_url: "https://picsum.photos/seed/banner-newborn/1800/700",
  "gallery_banner_smash-cake_url": "https://picsum.photos/seed/banner-smashcake/1800/700",
  gallery_banner_outdoor_url: "https://picsum.photos/seed/banner-outdoor/1800/700",
  gallery_banner_studio_url: "https://picsum.photos/seed/banner-studio/1800/700",
};

export type ContentMap = Record<string, string>;

/**
 * שולף את כל שורות הטקסט מטבלת site_content וממזג עם ברירות המחדל.
 * אם Supabase עדיין לא מחובר / הטבלה ריקה - האתר עדיין עולה תקין עם placeholders.
 */
export async function getSiteContent(): Promise<ContentMap> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_content").select("key, value");

    if (error || !data) {
      return DEFAULT_CONTENT;
    }

    const merged: ContentMap = { ...DEFAULT_CONTENT };
    for (const row of data as { key: string; value: string }[]) {
      if (row.value) merged[row.key] = row.value;
    }
    return merged;
  } catch {
    // Supabase לא מוגדר עדיין (env vars ריקים) - נופלים חזרה לברירת המחדל בלי לשבור את הבנייה
    return DEFAULT_CONTENT;
  }
}
