/**
 * מילה דהויה ברקע, בהשראת הקונספט שנשלח - משולבת בעדינות מאחורי
 * הכותרת של הסקשן (לא ממורכזת ענקית על פני כל הסקשן), כדי שתוסיף
 * אופי בלי להתחרות עם התוכן. aria-hidden כי היא דקורטיבית בלבד.
 *
 * top-0 (לא ערך שלילי) - מיקום שלילי (מעל התיבה) גרם לחלק העליון של
 * האותיות (בעיקר עם lineHeight צפוף) להיחתך ע"י overflow-hidden של
 * ההורה. עכשיו המילה תמיד נשארת בתוך גבולות התיבה שמכילה אותה.
 */
export default function BackgroundWord({
  word,
  align = "start",
  tone = "mist",
}: {
  word: string;
  align?: "start" | "center" | "end";
  tone?: "mist" | "bone";
}) {
  const alignClass =
    align === "center" ? "justify-center text-center" : align === "end" ? "justify-end text-end" : "justify-start text-start";
  const toneClass = tone === "bone" ? "text-bone/70" : "text-mist/80";

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-x-0 top-0 z-0 flex ${alignClass} overflow-hidden`}
    >
      <span
        className={`font-display ${toneClass} whitespace-nowrap`}
        style={{ fontSize: "clamp(2.75rem, 7vw, 6rem)", lineHeight: 1.15, paddingTop: "0.15em" }}
      >
        {word}
      </span>
    </span>
  );
}
