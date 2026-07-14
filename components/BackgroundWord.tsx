/**
 * מילה ענקית ודהויה ברקע, כמו בקונספט שנשלח - נותנת עומק ואופי
 * עיצובי בלי להסיח את הדעת מהתוכן שמעליה. aria-hidden כי היא
 * דקורטיבית בלבד. ממוקמת מאחורי התוכן (z-index נמוך) בתוך סקשן
 * עם overflow-hidden.
 */
export default function BackgroundWord({ word }: { word: string }) {
  return (
    <span
      aria-hidden="true"
      className="protected-image pointer-events-none select-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <span
        className="font-display text-mist whitespace-nowrap"
        style={{ fontSize: "clamp(6rem, 18vw, 16rem)", lineHeight: 1 }}
      >
        {word}
      </span>
    </span>
  );
}
