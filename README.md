# אתר פורטפוליו צילום

פרויקט Next.js + Supabase, בסגנון מינימליסטי-יוקרתי בהשראת ZARA.
כל התוכן הטקסטואלי והתמונות ניתנים לעריכה מלוח הבקרה (`/admin`) —
עד אז האתר עולה עם טקסטים זמניים (placeholder) ותמונות דוגמה.

## מבנה

```
app/                    עמודים (App Router)
  page.tsx              דף הבית
  gallery/[category]/   דפי גלריה דינמיים
  admin/                לוח בקרה מוגן (login + dashboard)
  api/contact/          שליחת מייל דרך הטופס (Resend)
  api/admin/            פעולות מנהל בצד שרת (מחיקת תמונה)
components/             קומפוננטות UI
lib/supabase/           קליינטים ל-Supabase (client/server/admin)
lib/content.ts          שליפת טקסטים + ברירות מחדל
supabase/schema.sql     סכימת מסד הנתונים - להריץ פעם אחת ב-Supabase
```

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   #  למלא את המשתנים (ראו למטה)
npm run dev
```

בלי משתני סביבה האתר עדיין עולה ומציג תוכן זמני — אבל טופס יצירת
הקשר, הגלריות הדינמיות והדשבורד לא יעבדו עד שיוגדר Supabase.

## הגדרת Supabase (פעם אחת)

1. יוצרים פרויקט חדש ב-[supabase.com](https://supabase.com) (חינמי).
2. **Project Settings → API** — מעתיקים את ה-`Project URL`, `anon public key`
   ואת `service_role key` (הסודי, לא לחשוף).
3. **SQL Editor** — מריצים את כל התוכן של `supabase/schema.sql`.
4. **Storage** — יוצרים bucket חדש בשם `gallery`, מסומן כ-Public.
5. **Authentication → Users** — יוצרים משתמש (אימייל+סיסמה) שישמש
   להתחברות לדשבורד ב-`/admin/login`.
6. מכניסים את הערכים ל-`.env.local` (מקומי) ול-Environment Variables
   בפרויקט Vercel (לפרודקשן).

## הגדרת Resend (מיילים)

1. נרשמים ב-[resend.com](https://resend.com) (יש תוכנית חינמית).
2. מאמתים דומיין שממנו יישלחו המיילים (או משתמשים בדומיין הבדיקה
   שלהם עד שיהיה דומיין קבוע).
3. יוצרים API key ומכניסים ל-`RESEND_API_KEY`.
4. `CONTACT_TO_EMAIL` = הכתובת שלך שאליה יגיעו פניות.
   `CONTACT_FROM_EMAIL` = כתובת השולח המאומתת.

## דומיין ופריסה (Vercel)

Vercel נותן **דומיין חינמי אוטומטית** עם כל פריסה — אין צורך "לחפש"
דומיין בנפרד:

1. מעלים את הפרויקט ל-GitHub.
2. מתחברים ל-[vercel.com](https://vercel.com) עם GitHub, ובוחרים "Import Project".
3. Vercel יציע כתובת אוטומטית בסגנון `project-name.vercel.app`
   (ניתן לשנות את שם הפרויקט כדי לשנות את הכתובת).
4. מוסיפים שם את משתני הסביבה מ-`.env.example` (Settings → Environment Variables).
5. HTTPS מופעל אוטומטית - אין צורך בהגדרה נוספת.

דומיין אישי (למשל `.co.il` או `.com`) הוא תמיד בתשלום ברכישה
ראשונית — לא קיימת דרך אמיתית וחינמית לחלוטין לקבל דומיין כזה.
כשתרצי לשדרג, ניתן לחבר דומיין קנוי ל-Vercel בקלות (Settings → Domains).

## שם הפרויקט / הדומיין הזמני

הפרויקט מוגדר בשם `sara-stal-photography` — ב-Vercel זה ייתן כתובת
כמו `sara-stal-photography.vercel.app`. אפשר לקצר את שם הפרויקט
ב-Vercel (למשל ל-`sara-stal`) כדי לקבל כתובת קצרה יותר:
`sara-stal.vercel.app`.

## דחיסת תמונות

כל תמונה שמועלית דרך הדשבורד עוברת דחיסה **בדפדפן, לפני ההעלאה**
(עד 2000px ברוחב/גובה, איכות JPEG שמאזנת גודל מול חדות). אין צורך
בשירות חיצוני נוסף (כמו Cloudinary) ואין מפתח API נוסף לנהל -
הדחיסה קורית מקומית אצל המשתמשת בזמן ההעלאה.

## מניעת השהיה של הפרויקט (Supabase Keep-Alive)

פרויקט Supabase בתוכנית החינמית נכנס להשהיה אחרי שבוע ללא פעילות.
בתיקייה `.github/workflows/keep-alive.yml` יש סקריפט שרץ **אוטומטית
כל יום ראשון** ושולח פנייה קטנה לפרויקט כדי לשמור אותו פעיל -
לא צריך לזכור לעשות שום דבר ידנית.

כדי שהסקריפט יעבוד, אחרי שמעלים את הפרויקט ל-GitHub:
1. בתוך ה-repository ב-GitHub: **Settings → Secrets and variables → Actions → New repository secret**
2. מוסיפים שני secrets:
   - `SUPABASE_URL` = אותו Project URL מ-Supabase
   - `SUPABASE_ANON_KEY` = אותו anon public key
3. זהו - מ-GitHub Secrets, לא מקוד גלוי, ואין צורך לגעת בזה שוב.

אפשר גם להריץ את הסקריפט ידנית בכל רגע: בטאב **Actions** ב-GitHub → "Supabase keep-alive" → "Run workflow".

## הערה לגבי חסימת הורדת תמונות



החסימה (קליק ימני + גרירה) היא הרתעה בלבד ולא הגנה טכנית מוחלטת —
כל תמונה שמוצגת בדפדפן ניתנת לצילום מסך. לרמת הגנה גבוהה יותר
אפשר להוסיף watermark על התמונות בזמן ההעלאה.
