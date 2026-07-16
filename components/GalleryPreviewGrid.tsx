import Link from "next/link";
import Image from "next/image";

type PreviewItem = {
  slug: string;
  label: string;
  caption?: string;
  imageUrl: string;
};

function Tile({ item }: { item: PreviewItem }) {
  return (
    <Link href={`/gallery/${item.slug}`} className="group block relative">
      {/*
        יחס גובה-רוחב אחיד לכל האריחים (4/5) - זה מה שהופך את השורה
        לסימטרית ומסודרת; הגיוון עובר עכשיו ל-hover: העלייה קלה בגודל
        + z-10 גורמים לאריח שמרחפים מעליו "לצוף מעל" את השכנים שלו,
        תחושת קולאז' עדינה בלי לשבור את הסדר הבסיסי.
      */}
      <div className="relative overflow-hidden bg-mist aspect-[4/5] transition-transform duration-500 ease-editorial group-hover:scale-[1.06] group-hover:z-10 group-hover:shadow-[0_18px_34px_-14px_rgba(61,58,54,0.35)]">
        <Image
          src={item.imageUrl}
          alt={item.label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="protected-image object-cover"
        />
        <span className="hover-veil" />
      </div>
      {/* הטקסט מתחת לתמונה (לא overlay עליה) - עקבי עם שאר העמודים באתר */}
      <span className="block mt-3 text-center">
        <span className="eyebrow block group-hover:text-olive transition-colors duration-300">
          {item.label}
        </span>
        {item.caption && <span className="block text-xs text-stone mt-1">{item.caption}</span>}
      </span>
    </Link>
  );
}

/**
 * פריסה סימטרית לגמרי - כל האריחים באותו יחס גובה-רוחב, אז השורה
 * תמיד מיושרת ונקייה. הרפרוף (hover) הוא מה שיוצר עכשיו את תחושת
 * הדינמיות/קולאז' - אריח גדל מעט ו"צף" מעל השכנים שלו.
 */
export default function GalleryPreviewGrid({ items }: { items: PreviewItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-8">
      {items.map((item) => (
        <Tile key={item.slug} item={item} />
      ))}
    </div>
  );
}
