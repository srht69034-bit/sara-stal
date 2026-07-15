import type { ContentMap } from "@/lib/content";

export const GALLERY_SLUGS = ["chalakah", "newborn", "smash-cake", "outdoor", "studio"] as const;
export type GallerySlug = (typeof GALLERY_SLUGS)[number];

const LABEL_KEY: Record<GallerySlug, string> = {
  chalakah: "gallery_chalakah_label",
  newborn: "gallery_newborn_label",
  "smash-cake": "gallery_smashcake_label",
  outdoor: "gallery_outdoor_label",
  studio: "gallery_studio_label",
};

const CAPTION_KEY: Record<GallerySlug, string> = {
  chalakah: "preview_chalakah_caption",
  newborn: "preview_newborn_caption",
  "smash-cake": "preview_smashcake_caption",
  outdoor: "preview_outdoor_caption",
  studio: "preview_studio_caption",
};

const IMAGE_KEY: Record<GallerySlug, string> = {
  chalakah: "preview_chalakah_image_url",
  newborn: "preview_newborn_image_url",
  "smash-cake": "preview_smashcake_image_url",
  outdoor: "preview_outdoor_image_url",
  studio: "preview_studio_image_url",
};

// שמות הגלריות ניתנים לעריכה מלאה מהדשבורד (ContentEditor) - הפונקציות
// האלה קוראות את הערך שנשמר שם, במקום שם קבוע בקוד, כדי שהעריכה תופיע
// בכל מקום באתר (תפריט, כותרת עמוד הגלריה, סינון, אריחי עמוד הבית).
export function galleryLabels(content: ContentMap): Record<GallerySlug, string> {
  return Object.fromEntries(
    GALLERY_SLUGS.map((slug) => [slug, content[LABEL_KEY[slug]]])
  ) as Record<GallerySlug, string>;
}

export function galleryLabel(content: ContentMap, slug: string): string {
  const key = LABEL_KEY[slug as GallerySlug];
  return key ? content[key] : slug;
}

export function galleryCaption(content: ContentMap, slug: GallerySlug): string {
  return content[CAPTION_KEY[slug]] ?? "";
}

export function galleryPreviewImage(content: ContentMap, slug: GallerySlug): string {
  return content[IMAGE_KEY[slug]] ?? "";
}
