/**
 * Supabase Storage דורש נתיבים "בטוחים" (ASCII, בלי רווחים/תווים
 * מיוחדים) - שם קובץ בעברית או עם רווחים היה גורם לשגיאת העלאה.
 * הפונקציה הזו לוקחת את שם הקובץ המקורי (רק לצורך זיהוי אנושי) ומייצרת
 * ממנו מזהה בטוח, בעודה שומרת את הסיומת המקורית.
 */
export function safeFileName(originalName: string): string {
  const dotIndex = originalName.lastIndexOf(".");
  const ext = dotIndex >= 0 ? originalName.slice(dotIndex + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "jpg";
  const safeExt = ext || "jpg";
  const random = Math.random().toString(36).slice(2, 8);
  return `${Date.now()}-${random}.${safeExt}`;
}
