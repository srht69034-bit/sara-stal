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
import { GALLERY_SLUGS, galleryLabels, galleryLabel, galleryCaption, galleryPreviewImage } from "@/lib/galleries";

export const revalidate = 30;

export default async function HomePage() {
  const [content, testimonials, albums] = await Promise.all([
    getSiteContent(),
    getTestimonials(),
    getAlbums(),
  ]);

  const shapes = { outdoor: "landscape", chalakah: "square", studio: "square", newborn: "portrait", "smash-cake": "landscape" } as const;

  return (
    <>
      <Header siteName={content.site_name} logoUrl={content.logo_image_url} galleryLabels={galleryLabels(content)} />

      {/* Hero - תמונת רקע אחת גדולה עם תנועה איטית (Ken Burns) וכותרת ממוקמת בטוב טעם */}
      {/*
        hero-height (מוגדר ב-globals.css) - כותב את הגובה פעמיים
        (vh ואז dvh) כדי שדפדפני מובייל יחשבו את הגובה נכון גם כששורת
        הכתובת מתכווצת/מתרחבת, ולא "יחתכו" את התמונה בתחתית.
      */}
      <section className="relative hero-height min-h-[600px] w-full overflow-hidden">
        <HeroImage src={content.hero_image_url} alt="תמונת נושא" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/15 to-transparent" />

        <div className="relative z-10 flex h-full items-end">
          <div className="mx-auto w-full max-w-editorial px-6 sm:px-8 md:px-10 pb-24 sm:pb-28 md:pb-32">
            <AnimatedReveal>
              <p className="eyebrow mb-5 text-bone/85">פורטפוליו צילום</p>
              <h1 className="font-display text-bone text-3xl sm:text-4xl md:text-6xl leading-[1.15] max-w-2xl break-words">
                {content.hero_title}
              </h1>
              <p className="text-bone/90 text-base sm:text-lg mt-6 max-w-md font-light">{content.hero_subtitle}</p>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Galleries - פריסת "גלריית אמנות" קומפקטית וסימטרית */}
      <section className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-24 pb-24">
        <AnimatedReveal>
          <p className="eyebrow mb-10 text-center">{content.galleries_title}</p>
        </AnimatedReveal>
        <AnimatedReveal delay={0.1} direction="scale">
          <GalleryPreviewGrid
            items={GALLERY_SLUGS.map((slug) => ({
              slug,
              label: galleryLabel(content, slug),
              caption: galleryCaption(content, slug),
              imageUrl: galleryPreviewImage(content, slug),
              shape: shapes[slug],
            }))}
          />
        </AnimatedReveal>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-12 pb-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center"
      >
        <AnimatedReveal direction="right" className="order-2 md:order-1">
          <div className="aspect-[4/5] bg-mist overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.about_image_url}
              alt="תמונה אישית"
              className="protected-image h-full w-full object-cover"
            />
          </div>
        </AnimatedReveal>
        {/* המילה השקופה מוגבלת לעמודת הטקסט בלבד, כדי שלא "תיתקע" מעל התמונה */}
        <div className="relative order-1 md:order-2 overflow-hidden">
          <BackgroundWord word="Story" align="start" />
          <AnimatedReveal direction="left" className="relative z-10">
            <p className="eyebrow mb-6">{content.about_title}</p>
            <p className="text-lg leading-relaxed whitespace-pre-line">{content.about_body}</p>
          </AnimatedReveal>
        </div>
      </section>

      {/* Albums teaser - קישור לעמוד האלבומים, גם באמצע העמוד וגם בתפריט */}
      <AlbumsTeaser albums={albums} content={content} />

      {/* Booking steps - שלבי ההזמנה */}
      <div className="pb-10">
        <BookingSteps content={content} />
      </div>

      {/* Testimonials - קרוסלה מתחלפת, המלצות ניתנות לניהול מהדשבורד */}
      {/* רקע (mist) מתחיל קצת לפני תחילת ההמלצות, עם ריפוד גדול משני הצדדים
          כדי שהגבול מהסקשן הקודם יהיה ברור ולא "דבוק" */}
      <section className="relative bg-mist/40 overflow-hidden pt-6">
        <div className="relative mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-28 pb-20">
          {/* צבע bone (במקום mist) - כך שהמילה השקופה תיראה נכון על רקע ה-mist הכהה מעט של הסקשן הזה */}
          <BackgroundWord word="Moments" align="center" tone="bone" />
          <div className="relative z-10">
            <AnimatedReveal direction="scale">
              <TestimonialCarousel items={testimonials} />
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Contact - pt נוסף כדי שלא יידבק לסקשן ההמלצות שלפניו */}
      <section id="contact" className="relative mx-auto max-w-editorial px-8 sm:px-10 md:px-12 pt-32 pb-32 overflow-hidden">
        <BackgroundWord word="Connect" align="start" />
        <div className="relative z-10">
          <AnimatedReveal>
            <p className="eyebrow mb-6">{content.contact_title}</p>
            <p className="text-stone mb-8 max-w-md whitespace-pre-line">{content.contact_body}</p>
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
