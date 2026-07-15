import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/content";
import ContentEditor from "@/components/admin/ContentEditor";
import ImageManager from "@/components/admin/ImageManager";
import SiteImageEditor from "@/components/admin/SiteImageEditor";
import AlbumManager from "@/components/admin/AlbumManager";
import TestimonialManager from "@/components/admin/TestimonialManager";
import AdminTabs from "@/components/admin/AdminTabs";

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
      <p className="text-stone mb-8">עריכת טקסטים ותמונות באתר</p>

      <AdminTabs
        tabs={[
          { id: "texts", label: "טקסטים", content: <ContentEditor initialContent={content} /> },
          { id: "images", label: "תמונות עיצוב", content: <SiteImageEditor initialContent={content} /> },
          { id: "galleries", label: "גלריות", content: <ImageManager /> },
          { id: "albums", label: "אלבומים", content: <AlbumManager /> },
          { id: "testimonials", label: "המלצות", content: <TestimonialManager /> },
        ]}
      />
    </main>
  );
}
