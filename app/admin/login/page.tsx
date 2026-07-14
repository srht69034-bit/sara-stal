"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError("פרטי התחברות שגויים");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-bone px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <h1 className="font-display text-2xl mb-2">כניסת מנהל</h1>
        <input
          type="email"
          required
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-b border-mist bg-transparent py-2 outline-none focus:border-ink"
        />
        <input
          type="password"
          required
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b border-mist bg-transparent py-2 outline-none focus:border-ink"
        />
        {error && <p className="text-sm text-rust">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="eyebrow border border-ink px-6 py-3 hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </main>
  );
}
