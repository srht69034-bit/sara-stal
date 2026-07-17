import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAlbums } from "@/lib/albums";
import { getSiteContent } from "@/lib/content";
import { galleryLabels } from "@/lib/galleries";

/**
 * עמוד האלבומים בכוונה בסגנון שונה מהאתר הראשי: רקע כהה (ink) במקום
 * שמנת, טקסט בהיר, ושורות מתחלפות (תמונה מימין/משמאל) - נותן תחושה
 * של "ספר קפה" יוקרתי, שונה מהגלריות המאווררות בעמוד הבית.
 */
export const revalidate = 30;

export default async function AlbumsPage() {
  const [albums, content] = await Promise.all([getAlbums(), getSiteContent()]);

  return (
    <div className="bg-ink text-bone min-h-screen">
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} galleryLabels={galleryLabels(content)} />

      <section className="mx-auto max-w-editorial px-8 md:px-10 pt-32 pb-12 text-center">
        <p className="eyebrow text-bone/70 mb-5">אלבומי לקוחות</p>
        <h1 className="font-display text-4xl md:text-5xl tracking-wide max-w-2xl mx-auto leading-relaxed">
          כל סיפור מקבל אלבום משלו
        </h1>
      </section>

      {albums.length === 0 ? (
        <p className="mx-auto max-w-editorial px-8 md:px-10 py-24 text-bone/60">
          אלבומים יתווספו כאן בקרוב.
        </p>
      ) : (
        <div className="pb-24">
          {albums.map((album, i) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className={`group flex flex-col md:flex-row ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-stretch border-t border-bone/10`}
            >
              <div className="md:w-1/2 aspect-[4/3] overflow-hidden bg-bone/10">
                {album.cover_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={album.cover_url}
                    alt={album.title}
                    className="protected-image h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-14">
                <h2 className="font-display text-3xl mb-4">{album.title}</h2>
                {album.description && (
                  <p className="text-bone/70 max-w-md leading-relaxed whitespace-pre-line">{album.description}</p>
                )}
                <span className="eyebrow text-olive mt-8 inline-flex items-center gap-2">
                  לצפייה באלבום
                  <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="bg-bone text-ink">
        <Footer
          phone={content.footer_phone}
          email={content.footer_email}
          credit={content.footer_credit}
          instagram={content.footer_instagram}
        />
      </div>
    </div>
  );
}
