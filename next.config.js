/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // picsum.photos משמש לתמונות placeholder זמניות (עד שמעלים תמונות
        // אמיתיות דרך הדשבורד) - בלי זה, next/image חוסם אותן עם שגיאת 400
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

module.exports = nextConfig;
