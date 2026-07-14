"use client";

import { useEffect } from "react";

/**
 * שכבת הגנה בסיסית מפני שמירת תמונות: חוסמת קליק ימני וגרירה על כל האתר.
 * חשוב להבהיר: זו הרתעה בלבד, לא הגנה טכנית אמיתית - כל תמונה שמוצגת
 * בדפדפן ניתנת לצילום מסך. לרמת הגנה גבוהה יותר יש להוסיף watermark.
 */
export default function NoRightClick() {
  useEffect(() => {
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDragStart = (e: DragEvent) => e.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("dragstart", blockDragStart);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return null;
}
