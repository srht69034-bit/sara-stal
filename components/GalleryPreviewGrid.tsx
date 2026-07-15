import Link from "next/link";

type Shape = "square" | "portrait" | "landscape";

type PreviewItem = {
  slug: string;
  label: string;
  caption?: string;
  imageUrl: string;
  shape: Shape;
};

const ASPECT: Record<Shape, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
};

function Tile({ item }: { item: PreviewItem }) {
  return (
    <Link href={`/gallery/${item.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-mist ${ASPECT[item.shape]}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.imageUrl}
          alt={item.label}
          className="protected-image h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.04]"
          loading="lazy"
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
 * פריסה קומפקטית וסימטרית: כל האריחים באותו רוחב עמודה (grid אחיד,
 * ללא col-span שיוצר "שורה חסרה" ורווחים לא אחידים) - תמהיל הצורות
 * נוצר רק דרך aspect-ratio שונה לכל אריח, לא דרך שינוי רוחב.
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
