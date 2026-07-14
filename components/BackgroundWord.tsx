/**
 * מילה דהויה ברקע, בהשראת הקונספט שנשלח - משולבת בעדינות מאחורי
 * הכותרת של הסקשן (לא ממורכזת ענקית על פני כל הסקשן), כדי שתוסיף
 * אופי בלי להתחרות עם התוכן. aria-hidden כי היא דקורטיבית בלבד.
 */
export default function BackgroundWord({
  word,
  align = "start",
}: {
  word: string;
  align?: "start" | "center" | "end";
}) {
  const alignClass =
    align === "center" ? "justify-center text-center" : align === "end" ? "justify-end text-end" : "justify-start text-start";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-x-0 -top-2 md:-top-4 z-0 flex ${alignClass} overflow-hidden`}
    >
      <span
        className="font-display text-mist/80 whitespace-nowrap"
        style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)", lineHeight: 1 }}
      >
        {word}
      </span>
    </span>
  );
}
