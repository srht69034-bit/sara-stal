-- ==========================================================
-- מיגרציה נוספת - להריץ פעם אחת ב-Supabase: Project > SQL Editor > New Query
-- (בנוסף ל-schema.sql ול-migration_02 שכבר הרצת - זה לא מחליף אותם)
-- מוסיפה שדה באנר נפרד לאלבום, שונה מתמונת השער/התמונה הראשית
-- (cover_url ממשיכה לשמש כתמונה הראשית/thumbnail בעמוד רשימת האלבומים,
-- banner_url משמשת כתמונת הרקע הגדולה בראש עמוד האלבום הבודד)
-- ==========================================================

alter table albums add column if not exists banner_url text default '';
alter table albums add column if not exists banner_path text default '';
