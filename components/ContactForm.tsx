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

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      sessionType: (form.elements.namedItem("sessionType") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
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
        <p className="text-sm text-rust">משהו השתבש, נסו שוב או צרו קשר ישירות במייל.</p>
      )}
    </form>
  );
}
