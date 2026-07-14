import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * קליינט Supabase לשימוש בצד שרת (Server Components, Route Handlers).
 * קורא/כותב עוגיות session כדי לשמור על מצב ההתחברות של המנהל.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // מתרחש כשקוראים מתוך Server Component - אפשר להתעלם, ה-middleware מטפל ברענון
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // ראה הערה למעלה
          }
        },
      },
    }
  );
}

/**
 * קליינט "אדמין" עם ה-service_role key - עוקף Row Level Security.
 * משמש אך ורק בפעולות שרת רגישות (כמו מחיקת קובץ פיזית מה-Storage).
 * אסור לייבא קובץ זה לשום קומפוננטת קליינט.
 */
export function createAdminClient() {
  const { createClient: createSupabaseClient } = require("@supabase/supabase-js");
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
