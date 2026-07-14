-- ==========================================================
-- מיגרציה נוספת - להריץ פעם אחת ב-Supabase: Project > SQL Editor > New Query
-- (בנוסף ל-schema.sql שכבר הרצת - זה לא מחליף אותו)
-- מוסיף: אלבומים, תמונות בתוך אלבומים, והמלצות לקוחות
-- ==========================================================

-- טבלת אלבומים - כמות בלתי מוגבלת, כל אלבום עם כותרת/תיאור/תמונת שער
create table if not exists albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  cover_url text default '',
  cover_path text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table albums enable row level security;

create policy "albums_public_read"
  on albums for select
  using (true);

create policy "albums_admin_write"
  on albums for insert
  with check (auth.role() = 'authenticated');

create policy "albums_admin_update"
  on albums for update
  using (auth.role() = 'authenticated');

create policy "albums_admin_delete"
  on albums for delete
  using (auth.role() = 'authenticated');


-- טבלת תמונות בתוך אלבום - קשורה לאלבום ספציפי, נמחקת אוטומטית איתו
create table if not exists album_images (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references albums(id) on delete cascade,
  path text not null,
  url text not null,
  alt text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table album_images enable row level security;

create policy "album_images_public_read"
  on album_images for select
  using (true);

create policy "album_images_admin_insert"
  on album_images for insert
  with check (auth.role() = 'authenticated');

create policy "album_images_admin_delete"
  on album_images for delete
  using (auth.role() = 'authenticated');


-- טבלת המלצות לקוחות - ניתנות להוספה/עריכה/מחיקה מהדשבורד
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text default '',
  sort_order integer default 0,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "testimonials_public_read"
  on testimonials for select
  using (true);

create policy "testimonials_admin_insert"
  on testimonials for insert
  with check (auth.role() = 'authenticated');

create policy "testimonials_admin_update"
  on testimonials for update
  using (auth.role() = 'authenticated');

create policy "testimonials_admin_delete"
  on testimonials for delete
  using (auth.role() = 'authenticated');

-- הערה: תמונות האלבומים משתמשות באותו bucket "gallery" שכבר קיים
-- (מדיניות הגישה שכבר הרצת ב-schema.sql מכסה גם אותן, תחת נתיב albums/...)
