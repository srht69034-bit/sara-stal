import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AlbumViewer from "@/components/AlbumViewer";
import { getAlbum, getAlbumImages } from "@/lib/albums";
import { getSiteContent } from "@/lib/content";

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const [album, content] = await Promise.all([getAlbum(params.id), getSiteContent()]);
  if (!album) notFound();

  const images = await getAlbumImages(album.id);

  return (
    <div className="bg-ink text-bone min-h-screen">
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} />

      <section className="mx-auto max-w-editorial px-8 md:px-10 pt-16 pb-10">
        <p className="eyebrow text-bone/70 mb-3">אלבום</p>
        <h1 className="font-display text-3xl md:text-4xl mb-3">{album.title}</h1>
        {album.description && (
          <p className="text-bone/70 max-w-xl leading-relaxed">{album.description}</p>
        )}
      </section>

      <section className="mx-auto max-w-editorial px-8 md:px-10 pb-24">
        <AlbumViewer images={images} />
      </section>

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
