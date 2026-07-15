"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const SESSION_TYPES = [
  { value: "chalakah", label: "חאלקה" },
  { value: "newborn", label: "ניובורן" },
  { value: "smash-cake", label: "סמאש קייק" },
  { value: "outdoor", label: "חוץ" },
  { value: "studio", label: "סטודיו" },
  { value: "other", label: "אחר" },
];

const SESSION_LABELS: Record<string, string> = Object.fromEntries(
  SESSION_TYPES.map((s) => [s.value, s.label])
);

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const sessionType = (form.elements.namedItem("sessionType") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMsg("טופס יצירת הקשר עדיין לא מוגדר - חסר NEXT_PUBLIC_WEB3FORMS_KEY בהגדרות הסביבה.");
      return;
    }

    try {
      // Web3Forms - שירות פשוט לשליחת טפסים לתיבת מייל, בלי צורך בדומיין
      // מאומת או שרת משלנו. ה-access_key ציבורי ובטוח לחשיפה בצד לקוח.
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `פנייה חדשה מהאתר - ${name}`,
          name,
          email,
          "סוג צילום": SESSION_LABELS[sessionType] ?? sessionType,
          message,
        }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.message ?? "send failed");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "משהו השתבש, נסו שוב או צרו קשר ישירות במייל.");
    }
  }

  if (status === "sent") {
    return <p className="text-stone">תודה! ההודעה נשלחה, אחזור אליך בקרוב.</p>;
  }

  const fieldClass =
    "border-b border-mist bg-transparent py-2.5 outline-none focus:border-olive transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
      <input name="name" required placeholder="שם מלא" className={fieldClass} />
      <input type="email" name="email" required placeholder="אימייל או טלפון" className={fieldClass} />

      <select name="sessionType" required defaultValue="" className={`${fieldClass} text-ink`}>
        <option value="" disabled>
          סוג הצילום
        </option>
        {SESSION_TYPES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <textarea
        name="message"
        required
        rows={4}
        placeholder="ספרו לי קצת על הרגע שתרצו לתעד"
        className={`${fieldClass} resize-none`}
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="eyebrow self-start border border-olive px-7 py-3 hover:bg-olive hover:text-bone transition-colors duration-300 disabled:opacity-50"
      >
        {status === "sending" ? "שולח..." : "שליחה"}
      </button>

      {status === "error" && (
        <p className="text-sm text-rust">{errorMsg ?? "משהו השתבש, נסו שוב או צרו קשר ישירות במייל."}</p>
      )}
    </form>
  );
}
