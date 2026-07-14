import Link from "next/link";

type Shape = "square" | "portrait" | "landscape";

type PreviewItem = {
  slug: string;
  label: string;
  imageUrl: string;
  shape: Shape;
};

const SHAPE_CLASS: Record<Shape, string> = {
  square: "col-span-1 aspect-square",
  portrait: "col-span-1 aspect-[3/4]",
  landscape: "col-span-2 aspect-[21/9]",
};

function Tile({ item }: { item: PreviewItem }) {
  return (
    <Link
      href={`/gallery/${item.slug}`}
      className={`group relative block overflow-hidden bg-mist ${SHAPE_CLASS[item.shape]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageUrl}
        alt={item.label}
        className="protected-image h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.02]"
        loading="lazy"
      />
      <span className="frame-hover" />
      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="eyebrow text-bone/90 italic text-[11px]">{item.label}</span>
      </span>
    </Link>
  );
}

/**
 * פריסת "גלריית אמנות" קומפקטית - 4 עמודות בדסקטופ, אריחים קטנים
 * ונגישים יותר (ולא תמונות ענקיות שתופסות את כל רוחב העמוד), עם
 * תמהיל צורות (מרובע / לאורך / לרוחב) ליצירת עניין ויזואלי.
 */
export default function GalleryPreviewGrid({ items }: { items: PreviewItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
      {items.map((item) => (
        <Tile key={item.slug} item={item} />
      ))}
    </div>
  );
}
