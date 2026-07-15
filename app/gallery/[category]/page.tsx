import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MasonryGallery, { GalleryImage } from "@/components/MasonryGallery";
import { getSiteContent } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import { GALLERY_SLUGS, galleryLabels, galleryLabel } from "@/lib/galleries";

async function getGalleryImages(category: string): Promise<GalleryImage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, url, alt")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return [];
    return data as GalleryImage[];
  } catch {
    // Supabase לא מוגדר עדיין - חוזרים מערך ריק, הגלריה תציג הודעת "בקרוב"
    return [];
  }
}

export default async function GalleryPage({
  params,
}: {
  params: { category: string };
}) {
  const content = await getSiteContent();
  const label = galleryLabel(content, params.category);
  const labels = galleryLabels(content);
  const images = await getGalleryImages(params.category);
  const bannerUrl = content[`gallery_banner_${params.category}_url`];

  return (
    <>
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} galleryLabels={labels} />

      {/* באנר עמוד הגלריה - ניתן להחלפה מהדשבורד לכל גלריה בנפרד */}
      <section className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt={label} className="protected-image absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-mist" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent" />
        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-editorial px-6 sm:px-8 md:px-10 pb-10">
            <p className="eyebrow text-bone/85 mb-2">גלריה</p>
            <h1 className="font-display text-bone text-3xl md:text-4xl">{label}</h1>
          </div>
        </div>
      </section>

      {/* סינון מהיר בין כל הגלריות */}
      <div className="border-b border-mist">
        <div className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 flex flex-wrap gap-6 py-5">
          {GALLERY_SLUGS.map((slug) => (
            <Link
              key={slug}
              href={`/gallery/${slug}`}
              className={`eyebrow transition-colors duration-300 ${
                slug === params.category ? "text-olive" : "hover:text-olive"
              }`}
            >
              {labels[slug]}
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-16 pb-28">
        <MasonryGallery images={images} />
      </section>

      <Footer
        phone={content.footer_phone}
        email={content.footer_email}
        credit={content.footer_credit}
        instagram={content.footer_instagram}
      />
    </>
  );
}

export function generateStaticParams() {
  return GALLERY_SLUGS.map((category) => ({ category }));
}
