import Link from "next/link";
import AnimatedReveal from "@/components/AnimatedReveal";
import type { Album } from "@/lib/albums";
import type { ContentMap } from "@/lib/content";

export default function AlbumsTeaser({ albums, content }: { albums: Album[]; content: ContentMap }) {
  const preview = albums.slice(0, 3);

  return (
    <section className="bg-ink text-bone py-24">
      <div className="mx-auto max-w-editorial px-8 md:px-10 grid md:grid-cols-2 gap-14 items-center">
        <AnimatedReveal direction="right">
          <div>
            <p className="eyebrow text-bone/70 mb-5">{content.albums_teaser_title}</p>
            <h2 className="font-display text-3xl md:text-4xl mb-6 max-w-md">
              {content.albums_teaser_body}
            </h2>
            <Link
              href="/albums"
              className="eyebrow inline-flex items-center gap-2 border border-olive px-6 py-3 hover:bg-olive transition-colors duration-300"
            >
              לכל האלבומים
              <span>←</span>
            </Link>
          </div>
        </AnimatedReveal>

        <AnimatedReveal direction="left" delay={0.1}>
          <div className="grid grid-cols-3 gap-3">
            {preview.length > 0
              ? preview.map((a) => (
                  <Link key={a.id} href={`/albums/${a.id}`} className="group aspect-[3/4] overflow-hidden bg-bone/10 block">
                    {a.cover_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.cover_url}
                        alt={a.title}
                        className="protected-image h-full w-full object-cover transition-transform duration-[1400ms] ease-editorial group-hover:scale-[1.03]"
                      />
                    )}
                  </Link>
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-bone/10" />
                ))}
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
