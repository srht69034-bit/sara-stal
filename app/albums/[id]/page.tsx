import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AlbumViewer from "@/components/AlbumViewer";
import { getAlbum, getAlbumImages, getAlbums } from "@/lib/albums";
import { getSiteContent } from "@/lib/content";
import { galleryLabels } from "@/lib/galleries";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const [album, content, allAlbums] = await Promise.all([
    getAlbum(params.id),
    getSiteContent(),
    getAlbums(),
  ]);
  if (!album) notFound();

  const images = await getAlbumImages(album.id);
  const otherAlbums = allAlbums.filter((a) => a.id !== album.id).slice(0, 4);

  return (
    <div className="bg-ink text-bone min-h-screen">
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} galleryLabels={galleryLabels(content)} />

      {/* תמונה ראשית לאלבום - הבאנר שהוגדר לו בדשבורד (או תמונה ראשית כגיבוי) */}
      {(album.banner_url || album.cover_url) && (
        <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={album.banner_url || album.cover_url}
            alt={album.title}
            className="protected-image absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        </section>
      )}

      <section className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-16 pb-10">
        <Link href="/albums" className="eyebrow text-bone/70 hover:text-olive transition-colors duration-300 inline-flex items-center gap-2 mb-8">
          → כל האלבומים
        </Link>
        <p className="eyebrow text-bone/70 mb-3">אלבום</p>
        <h1 className="font-display text-3xl md:text-4xl mb-3">{album.title}</h1>
        {album.description && (
          <p className="text-bone/70 max-w-xl leading-relaxed whitespace-pre-line">{album.description}</p>
        )}
      </section>

      <section className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pb-24">
        <AlbumViewer images={images} />
      </section>

      {/* אלבומים נוספים - קישורים מהירים בתחתית עמוד האלבום */}
      {otherAlbums.length > 0 && (
        <section className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pb-24 border-t border-bone/10 pt-16">
          <p className="eyebrow text-bone/70 mb-8">עוד אלבומים</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherAlbums.map((a) => (
              <Link key={a.id} href={`/albums/${a.id}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-bone/10">
                  {a.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.cover_url}
                      alt={a.title}
                      className="protected-image h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-3">
                    <span className="block text-[10px] tracking-widest2 uppercase text-bone/60">אלבום</span>
                  </span>
                </div>
                <p className="eyebrow mt-3 text-bone/80 group-hover:text-olive transition-colors duration-300">
                  {a.title}
                </p>
              </Link>
            ))}
          </div>
        </section>
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
