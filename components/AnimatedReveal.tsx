"use client";

import { useEffect, useRef } from "react";

type Direction = "up" | "left" | "right" | "scale";

const OFFSETS: Record<Direction, Record<string, number[]>> = {
  up: { y: [24, 0] },
  left: { x: [-28, 0] },
  right: { x: [28, 0] },
  scale: { scale: [0.96, 1] },
};

/**
 * עוטפת כל תוכן באנימציית כניסה עדינה שמופעלת ברגע שהאלמנט נכנס
 * לתצוגה (Motion One + inView). direction נותן מגוון תנועה בין
 * סקשנים שונים בעמוד (במקום שכל דבר "יעלה" באותה צורה בדיוק).
 */
export default function AnimatedReveal({
  children,
  delay = 0,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { animate, inView } = await import("motion");
      el.style.opacity = "0";

      cleanup = inView(el, () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (animate as any)(
          el,
          { opacity: [0, 1], ...OFFSETS[direction] },
          { duration: 0.9, delay, easing: [0.22, 1, 0.36, 1] }
        );
      });
    })();

    return () => cleanup?.();
  }, [delay, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
