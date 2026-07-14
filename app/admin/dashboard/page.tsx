import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import ContentEditor from "@/components/admin/ContentEditor";
import ImageManager from "@/components/admin/ImageManager";
import SiteImageEditor from "@/components/admin/SiteImageEditor";
import AlbumManager from "@/components/admin/AlbumManager";
import TestimonialManager from "@/components/admin/TestimonialManager";

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();

  return (
    <main className="min-h-screen bg-bone px-6 py-12 mx-auto max-w-4xl">
      <h1 className="font-display text-3xl mb-2">לוח בקרה</h1>
      <p className="text-stone mb-10">עריכת טקסטים ותמונות באתר</p>

      <section className="mb-16">
        <h2 className="eyebrow mb-6">טקסטים</h2>
        <ContentEditor initialContent={content} />
      </section>

      <section className="mb-16">
        <h2 className="eyebrow mb-6">תמונות עיצוב (באנר, אודות, לוגו, קישורי גלריה בעמוד הבית)</h2>
        <SiteImageEditor initialContent={content} />
      </section>

      <section className="mb-16">
        <h2 className="eyebrow mb-6">גלריות ותמונות (כולל באנר לכל גלריה)</h2>
        <ImageManager />
      </section>

      <section className="mb-16">
        <h2 className="eyebrow mb-6">אלבומים</h2>
        <AlbumManager />
      </section>

      <section>
        <h2 className="eyebrow mb-6">המלצות לקוחות</h2>
        <TestimonialManager />
      </section>
    </main>
  );
}
