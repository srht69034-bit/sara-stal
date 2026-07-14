import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryPreviewGrid from "@/components/GalleryPreviewGrid";
import ContactForm from "@/components/ContactForm";
import AnimatedReveal from "@/components/AnimatedReveal";
import HeroImage from "@/components/HeroImage";
import BookingSteps from "@/components/BookingSteps";
import AlbumsTeaser from "@/components/AlbumsTeaser";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import BackgroundWord from "@/components/BackgroundWord";
import { getSiteContent } from "@/lib/content";
import { getTestimonials } from "@/lib/testimonials";
import { getAlbums } from "@/lib/albums";

// shape קובע את הפרופורציה של האריח בפריסת ה"גלריית אמנות" בעמוד הבית.
// התמונות עצמן (imageKey) מגיעות מ-site_content וניתנות להחלפה מהדשבורד.
const PREVIEW_ITEMS = [
  { slug: "outdoor", labelKey: "gallery_outdoor_label", imageKey: "preview_outdoor_image_url", shape: "landscape" as const },
  { slug: "chalakah", labelKey: "gallery_chalakah_label", imageKey: "preview_chalakah_image_url", shape: "square" as const },
  { slug: "studio", labelKey: "gallery_studio_label", imageKey: "preview_studio_image_url", shape: "square" as const },
  { slug: "newborn", labelKey: "gallery_newborn_label", imageKey: "preview_newborn_image_url", shape: "portrait" as const },
  { slug: "smash-cake", labelKey: "gallery_smashcake_label", imageKey: "preview_smashcake_image_url", shape: "landscape" as const },
];

export default async function HomePage() {
  const [content, testimonials, albums] = await Promise.all([
    getSiteContent(),
    getTestimonials(),
    getAlbums(),
  ]);

  return (
    <>
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} />

      {/* Hero - תמונת רקע אחת גדולה עם תנועה איטית (Ken Burns) וכותרת ממוקמת בטוב טעם */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <HeroImage src={content.hero_image_url} alt="תמונת נושא" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/15 to-transparent" />

        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-editorial px-8 md:px-10 pb-16 md:pb-20">
            <AnimatedReveal>
              <p className="eyebrow mb-5 text-bone/85">פורטפוליו צילום</p>
              <h1 className="font-display text-bone text-4xl md:text-6xl leading-[1.1] max-w-2xl">
                {content.hero_title}
              </h1>
              <p className="text-bone/90 text-lg mt-6 max-w-md font-light">{content.hero_subtitle}</p>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Galleries - פריסת "גלריית אמנות" קומפקטית עם תמהיל צורות */}
      <section className="mx-auto max-w-editorial px-8 md:px-10 pt-28 pb-24">
        <AnimatedReveal>
          <p className="eyebrow mb-10 text-center">{content.galleries_title}</p>
        </AnimatedReveal>
        <AnimatedReveal delay={0.1} direction="scale">
          <GalleryPreviewGrid
            items={PREVIEW_ITEMS.map((p) => ({
              slug: p.slug,
              label: content[p.labelKey],
              imageUrl: content[p.imageKey],
              shape: p.shape,
            }))}
          />
        </AnimatedReveal>
      </section>

      {/* Albums teaser - קישור לעמוד האלבומים, גם באמצע העמוד וגם בתפריט */}
      <AlbumsTeaser albums={albums} content={content} />

      {/* Booking steps - שלבי ההזמנה */}
      <BookingSteps content={content} />

      {/* Testimonials - קרוסלה מתחלפת, המלצות ניתנות לניהול מהדשבורד */}
      <section className="relative mx-auto max-w-editorial px-8 md:px-10 py-20 overflow-hidden">
        <BackgroundWord word="Moments" />
        <div className="relative z-10">
          <AnimatedReveal direction="scale">
            <TestimonialCarousel items={testimonials} />
          </AnimatedReveal>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="relative mx-auto max-w-editorial px-8 md:px-10 pt-4 pb-28 grid md:grid-cols-2 gap-16 items-center overflow-hidden"
      >
        <BackgroundWord word="Story" />
        <AnimatedReveal direction="right" className="relative z-10 order-2 md:order-1">
          <div className="aspect-[4/5] bg-mist overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.about_image_url}
              alt="תמונה אישית"
              className="protected-image h-full w-full object-cover"
            />
          </div>
        </AnimatedReveal>
        <div className="relative z-10 order-1 md:order-2">
          <AnimatedReveal direction="left">
            <p className="eyebrow mb-6">{content.about_title}</p>
            <p className="text-lg leading-relaxed">{content.about_body}</p>
          </AnimatedReveal>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative mx-auto max-w-editorial px-8 md:px-10 pb-32 overflow-hidden">
        <BackgroundWord word="Connect" />
        <div className="relative z-10">
          <AnimatedReveal>
            <p className="eyebrow mb-6">{content.contact_title}</p>
            <p className="text-stone mb-8 max-w-md">{content.contact_body}</p>
            <ContactForm />
          </AnimatedReveal>
        </div>
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
