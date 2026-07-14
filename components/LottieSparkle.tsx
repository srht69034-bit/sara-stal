"use client";

import { useEffect, useRef } from "react";

/**
 * אלמנט ויזואלי חי עדין (כוכב מנצנץ) - ממומש עם lottie-web, כפי
 * שהתבקש במסמך הדרישות. ניתן להחליף את public/animations/sparkle.json
 * בכל אנימציה אחרת שתורידי מ-lottiefiles.com.
 */
export default function LottieSparkle({ size = 28 }: { size?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: import("lottie-web").AnimationItem | undefined;

    (async () => {
      const lottie = (await import("lottie-web")).default;
      if (!containerRef.current) return;
      anim = lottie.loadAnimation({
        container: containerRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/sparkle.json",
      });
    })();

    return () => anim?.destroy();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
