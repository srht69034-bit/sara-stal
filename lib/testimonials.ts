import { createClient } from "@/lib/supabase/server";

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
};

const FALLBACK: Testimonial[] = [
  {
    id: "fallback-1",
    quote: "היא לא רק צילמה אותנו - היא תפסה בדיוק איך זה מרגיש להיות המשפחה שלנו.",
    author: "מתוך תגובת לקוחה",
  },
];

/**
 * שולף את רשימת ההמלצות מהטבלה testimonials, ממוינות לפי sort_order.
 * אם הטבלה עוד לא קיימת (לפני הרצת migration_02) או ריקה - נופלים
 * חזרה להמלצת placeholder אחת כדי שהעמוד לא ייראה ריק.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, author")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK;
    }
    return data as Testimonial[];
  } catch {
    return FALLBACK;
  }
}
