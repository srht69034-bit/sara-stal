-- ==========================================================
-- להריץ פעם אחת ב-Supabase: Project > SQL Editor > New Query
-- ==========================================================

-- טבלת טקסטים ניתנים לעריכה מהדשבורד
create table if not exists site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

-- כולם יכולים לקרוא (האתר הציבורי)
create policy "site_content_public_read"
  on site_content for select
  using (true);

-- רק משתמש מחובר (המנהל) יכול לכתוב
create policy "site_content_admin_write"
  on site_content for insert
  with check (auth.role() = 'authenticated');

create policy "site_content_admin_update"
  on site_content for update
  using (auth.role() = 'authenticated');


-- טבלת תמונות הגלריה
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  path text not null,
  url text not null,
  alt text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table gallery_images enable row level security;

create policy "gallery_images_public_read"
  on gallery_images for select
  using (true);

create policy "gallery_images_admin_insert"
  on gallery_images for insert
  with check (auth.role() = 'authenticated');

create policy "gallery_images_admin_delete"
  on gallery_images for delete
  using (auth.role() = 'authenticated');


-- ==========================================================
-- Storage: יש ליצור bucket בשם "gallery" דרך הממשק
-- (Storage > New bucket > Public bucket: כן)
-- ולאחר מכן להריץ את מדיניות הגישה הבאה:
-- ==========================================================

create policy "gallery_bucket_public_read"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "gallery_bucket_admin_upload"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "gallery_bucket_admin_delete"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ==========================================================
-- לבסוף: ליצור משתמש מנהל דרך Authentication > Users > Add user
-- (אימייל + סיסמה) - זה מה שישמש להתחברות ב-/admin/login
-- ==========================================================
