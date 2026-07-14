import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // מוודאים שיש session מנהל תקף לפני שמאפשרים מחיקה
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id, path } = await req.json();
  if (!id || !path) {
    return NextResponse.json({ error: "missing id or path" }, { status: 400 });
  }

  const admin = createAdminClient();

  // 1) מחיקה פיזית של הקובץ מ-Supabase Storage
  const { error: storageError } = await admin.storage.from("gallery").remove([path]);
  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 500 });
  }

  // 2) מחיקת השורה המתאימה מהטבלה
  const { error: dbError } = await admin.from("gallery_images").delete().eq("id", id);
  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
