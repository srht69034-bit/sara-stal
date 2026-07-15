import { createClient } from "@/lib/supabase/server";

export type Album = {
  id: string;
  title: string;
  description: string;
  cover_url: string;
};

export type AlbumImage = {
  id: string;
  url: string;
  alt: string;
};

export async function getAlbums(): Promise<Album[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("albums")
      .select("id, title, description, cover_url")
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as Album[];
  } catch {
    return [];
  }
}

export async function getAlbum(id: string): Promise<Album | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("albums")
      .select("id, title, description, cover_url")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as Album;
  } catch {
    return null;
  }
}

export async function getAlbumImages(albumId: string): Promise<AlbumImage[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("album_images")
      .select("id, url, alt")
      .eq("album_id", albumId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as AlbumImage[];
  } catch {
    return [];
  }
}
