"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { safeFileName } from "@/lib/sanitize";

type Album = {
  id: string;
  title: string;
  description: string;
  cover_url: string;
  cover_path: string;
  banner_url: string;
  banner_path: string;
};
type AlbumImg = { id: string; url: string; path: string; alt: string };

async function compress(rawFile: File): Promise<File> {
  try {
    return await imageCompression(rawFile, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
      fileType: "image/jpeg",
    });
  } catch {
    return rawFile;
  }
}

export default function AlbumManager() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const supabase = createClient();

  async function loadAlbums() {
    const { data, error } = await supabase
      .from("albums")
      .select("id, title, description, cover_url, cover_path, banner_url, banner_path")
      .order("created_at", { ascending: false });
    if (error) {
      setError(
        error.message.includes("does not exist") || error.code === "42P01"
          ? "טבלת האלבומים עוד לא קיימת ב-Supabase - יש להריץ את migration_02_albums_testimonials.sql ב-SQL Editor"
          : `שגיאה בטעינת אלבומים: ${error.message}`
      );
      return;
    }
    setError(null);
    setAlbums((data as Album[]) ?? []);
  }

  useEffect(() => {
    loadAlbums();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createAlbum() {
    if (!newTitle.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("albums").insert({
      title: newTitle,
      description: newDesc,
      sort_order: albums.length,
    });
    if (error) {
      setError(`שגיאה ביצירת אלבום: ${error.message}`);
    } else {
      setError(null);
      setNewTitle("");
      setNewDesc("");
    }
    setCreating(false);
    await loadAlbums();
  }

  async function updateAlbum(album: Album) {
    const { error } = await supabase
      .from("albums")
      .update({ title: album.title, description: album.description })
      .eq("id", album.id);
    setRowError((e) => ({ ...e, [album.id]: error ? `שגיאה בשמירה: ${error.message}` : "" }));
  }

  async function deleteAlbum(album: Album) {
    // מוחקת גם את תמונת השער מה-Storage (אם קיימת) לפני מחיקת הרשומה -
    // תמונות הפריטים בתוך האלבום נמחקות אוטומטית ע"י on delete cascade,
    // אבל קבצי ה-Storage שלהן נשארים יתומים; לכן קודם שולפים ומוחקים אותם.
    const { data: imgs } = await supabase
      .from("album_images")
      .select("path")
      .eq("album_id", album.id);
    const paths = (imgs ?? []).map((r: { path: string }) => r.path);
    if (album.cover_path) paths.push(album.cover_path);
    if (album.banner_path) paths.push(album.banner_path);
    if (paths.length > 0) {
      await supabase.storage.from("gallery").remove(paths);
    }
    const { error } = await supabase.from("albums").delete().eq("id", album.id);
    if (error) {
      setRowError((e) => ({ ...e, [album.id]: `שגיאה במחיקה: ${error.message}` }));
      return;
    }
    await loadAlbums();
  }

  async function uploadCover(album: Album, e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    const file = await compress(rawFile);
    const path = `albums/${album.id}/cover-${safeFileName(rawFile.name)}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (error) {
      setRowError((er) => ({ ...er, [album.id]: `שגיאה בהעלאת תמונה ראשית: ${error.message}` }));
      return;
    }
    const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);
    // מוחקת את התמונה הראשית הקודמת מה-Storage כדי לא להשאיר קבצים יתומים
    if (album.cover_path) await supabase.storage.from("gallery").remove([album.cover_path]);
    const { error: updateError } = await supabase
      .from("albums")
      .update({ cover_url: publicUrl.publicUrl, cover_path: path })
      .eq("id", album.id);
    if (updateError) {
      setRowError((er) => ({ ...er, [album.id]: `שגיאה בשמירת תמונה ראשית: ${updateError.message}` }));
      return;
    }
    setRowError((er) => ({ ...er, [album.id]: "" }));
    await loadAlbums();
  }

  async function uploadBanner(album: Album, e: React.ChangeEvent<HTMLInputElement>) {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;
    const file = await compress(rawFile);
    const path = `albums/${album.id}/banner-${safeFileName(rawFile.name)}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (error) {
      setRowError((er) => ({ ...er, [album.id]: `שגיאה בהעלאת באנר: ${error.message}` }));
      return;
    }
    const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);
    // מוחקת את הבאנר הקודם מה-Storage כדי לא להשאיר קבצים יתומים
    if (album.banner_path) await supabase.storage.from("gallery").remove([album.banner_path]);
    const { error: updateError } = await supabase
      .from("albums")
      .update({ banner_url: publicUrl.publicUrl, banner_path: path })
      .eq("id", album.id);
    if (updateError) {
      setRowError((er) => ({ ...er, [album.id]: `שגיאה בשמירת באנר: ${updateError.message}` }));
      return;
    }
    setRowError((er) => ({ ...er, [album.id]: "" }));
    await loadAlbums();
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 border border-mist p-5">
        <p className="text-sm text-stone">אלבום חדש</p>
        <input
          placeholder="כותרת האלבום"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
        />
        <textarea
          rows={2}
          placeholder="תיאור קצר (אופציונלי)"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          className="border border-mist bg-transparent p-3 outline-none focus:border-ink"
        />
        <button
          onClick={createAlbum}
          disabled={creating}
          className="self-start text-xs border border-ink px-5 py-3 hover:bg-ink hover:text-bone transition-colors disabled:opacity-50"
        >
          {creating ? "יוצרת..." : "יצירת אלבום"}
        </button>
        {error && <p className="text-xs text-rust">{error}</p>}
      </div>

      <div className="flex flex-col gap-4">
        {albums.map((album, i) => (
          <div key={album.id} className="border border-mist">
            <div className="flex items-center gap-4 p-4">
              <div className="flex gap-2 shrink-0">
                <div className="w-16 h-16 bg-mist overflow-hidden" title="תמונה ראשית">
                  {album.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.cover_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="w-16 h-16 bg-mist overflow-hidden" title="באנר">
                  {album.banner_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={album.banner_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  value={album.title}
                  onChange={(e) => {
                    const next = [...albums];
                    next[i] = { ...album, title: e.target.value };
                    setAlbums(next);
                  }}
                  className="border-b border-mist bg-transparent p-1 outline-none focus:border-ink font-display"
                />
                <input
                  value={album.description}
                  onChange={(e) => {
                    const next = [...albums];
                    next[i] = { ...album, description: e.target.value };
                    setAlbums(next);
                  }}
                  placeholder="תיאור"
                  className="border-b border-mist bg-transparent p-1 outline-none focus:border-ink text-sm text-stone"
                />
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <label className="text-xs border border-mist px-3 py-2 cursor-pointer hover:border-ink transition-colors text-center">
                  תמונה ראשית
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadCover(album, e)} />
                </label>
                <label className="text-xs border border-mist px-3 py-2 cursor-pointer hover:border-ink transition-colors text-center">
                  באנר לעמוד
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadBanner(album, e)} />
                </label>
                <button
                  onClick={() => updateAlbum(albums[i])}
                  className="text-xs border border-ink px-3 py-2 hover:bg-ink hover:text-bone transition-colors"
                >
                  שמירה
                </button>
                <button
                  onClick={() => deleteAlbum(album)}
                  className="text-xs border border-rust text-rust px-3 py-2 hover:bg-rust hover:text-bone transition-colors"
                >
                  מחיקת אלבום
                </button>
              </div>
            </div>

            {rowError[album.id] && <p className="text-xs text-rust px-4 pb-3">{rowError[album.id]}</p>}

            <button
              onClick={() => setExpanded(expanded === album.id ? null : album.id)}
              className="w-full text-xs text-stone border-t border-mist py-2.5 hover:text-ink transition-colors"
            >
              {expanded === album.id ? "סגירת תמונות ▲" : "ניהול תמונות באלבום ▼"}
            </button>

            {expanded === album.id && <AlbumImages albumId={album.id} />}
          </div>
        ))}
        {albums.length === 0 && <p className="text-sm text-stone">אין עדיין אלבומים.</p>}
      </div>
    </div>
  );
}

function AlbumImages({ albumId }: { albumId: string }) {
  const [images, setImages] = useState<AlbumImg[]>([]);
  const [uploaded, setUploaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function load() {
    const { data, error } = await supabase
      .from("album_images")
      .select("id, url, path, alt")
      .eq("album_id", albumId)
      .order("sort_order", { ascending: true });
    if (error) {
      setError(`שגיאה בטעינת תמונות: ${error.message}`);
      return;
    }
    setImages((data as AlbumImg[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setTotal(files.length);
    setUploaded(0);
    setError(null);
    const failures: string[] = [];

    for (const rawFile of files) {
      const file = await compress(rawFile);
      // שם קובץ בטוח (ASCII) - שם מקורי בעברית/עם רווחים היה גורם לשגיאת העלאה
      const path = `albums/${albumId}/${safeFileName(rawFile.name)}`;
      const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file, { upsert: false });
      if (uploadError) {
        failures.push(`${rawFile.name}: ${uploadError.message}`);
      } else {
        const { data: publicUrl } = supabase.storage.from("gallery").getPublicUrl(path);
        const { error: insertError } = await supabase.from("album_images").insert({
          album_id: albumId,
          path,
          url: publicUrl.publicUrl,
          alt: rawFile.name,
        });
        if (insertError) failures.push(`${rawFile.name}: ${insertError.message}`);
      }
      setUploaded((n) => n + 1);
    }

    setTotal(0);
    if (failures.length > 0) setError(`נכשלו ${failures.length} תמונות: ${failures.join(" · ")}`);
    await load();
  }

  async function handleDelete(img: AlbumImg) {
    const { error: storageError } = await supabase.storage.from("gallery").remove([img.path]);
    const { error: dbError } = await supabase.from("album_images").delete().eq("id", img.id);
    if (storageError || dbError) {
      setError(`שגיאה במחיקה: ${(storageError ?? dbError)?.message}`);
      return;
    }
    setError(null);
    await load();
  }

  return (
    <div className="p-4 border-t border-mist">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-xs border border-ink px-4 py-2.5 cursor-pointer hover:bg-ink hover:text-bone transition-colors">
          העלאת תמונות (ניתן לבחור כמה יחד)
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </label>
        {total > 0 && (
          <span className="text-xs text-stone">
            הועלו {uploaded} מתוך {total}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rust mb-3">{error}</p>}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square bg-mist overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            <button
              onClick={() => handleDelete(img)}
              className="absolute inset-0 bg-ink/60 text-bone text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              מחיקה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
