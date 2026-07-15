"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Row = { id: string; quote: string; author: string; sort_order: number };

export default function TestimonialManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, author, sort_order")
      .order("sort_order", { ascending: true });
    if (error) {
      setError(
        error.message.includes("does not exist") || error.code === "42P01"
          ? "טבלת ההמלצות עוד לא קיימת ב-Supabase - יש להריץ את migration_02_albums_testimonials.sql ב-SQL Editor"
          : `שגיאה בטעינת המלצות: ${error.message}`
      );
      return;
    }
    setError(null);
    setRows((data as Row[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addTestimonial() {
    if (!newQuote.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("testimonials").insert({
      quote: newQuote,
      author: newAuthor,
      sort_order: rows.length,
    });
    if (error) {
      setError(`שגיאה בהוספת המלצה: ${error.message}`);
    } else {
      setError(null);
      setNewQuote("");
      setNewAuthor("");
    }
    setSaving(false);
    await load();
  }

  const [rowError, setRowError] = useState<Record<string, string>>({});

  async function updateRow(row: Row) {
    const { error } = await supabase
      .from("testimonials")
      .update({ quote: row.quote, author: row.author })
      .eq("id", row.id);
    setRowError((e) => ({ ...e, [row.id]: error ? `שגיאה בשמירה: ${error.message}` : "" }));
  }

  async function deleteRow(id: string) {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      setRowError((e) => ({ ...e, [id]: `שגיאה במחיקה: ${error.message}` }));
      return;
    }
    await load();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 border border-mist p-5">
        <p className="text-sm text-stone">הוספת המלצה חדשה</p>
        <textarea
          rows={2}
          placeholder="טקסט ההמלצה"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
        />
        <input
          placeholder="שם הלקוחה (אופציונלי)"
          value={newAuthor}
          onChange={(e) => setNewAuthor(e.target.value)}
          className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
        />
        <button
          onClick={addTestimonial}
          disabled={saving}
          className="self-start text-xs border border-ink px-5 py-3 hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
        >
          {saving ? "מוסיפה..." : "הוספה"}
        </button>
        {error && <p className="text-xs text-rust">{error}</p>}
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row, i) => (
          <div key={row.id} className="flex flex-col gap-2 border-b border-mist pb-5">
            <textarea
              rows={2}
              value={row.quote}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, quote: e.target.value };
                setRows(next);
              }}
              className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
            />
            <input
              value={row.author}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, author: e.target.value };
                setRows(next);
              }}
              className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
            />
            <div className="flex gap-3">
              <button
                onClick={() => updateRow(rows[i])}
                className="text-xs border border-ink px-4 py-2.5 hover:bg-ink hover:text-bone transition-colors"
              >
                שמירה
              </button>
              <button
                onClick={() => deleteRow(row.id)}
                className="text-xs border border-rust text-rust px-4 py-2.5 hover:bg-rust hover:text-bone transition-colors"
              >
                מחיקה
              </button>
            </div>
            {rowError[row.id] && <p className="text-xs text-rust">{rowError[row.id]}</p>}
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-stone">אין עדיין המלצות שמורות.</p>}
      </div>
    </div>
  );
}
