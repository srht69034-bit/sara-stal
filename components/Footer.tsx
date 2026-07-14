import Link from "next/link";

export default function Footer({
  phone,
  email,
  credit,
  instagram,
}: {
  phone: string;
  email: string;
  credit: string;
  instagram?: string;
}) {
  return (
    <footer className="border-t border-mist mt-32 bg-mist/20">
      <div className="mx-auto max-w-editorial px-6 sm:px-8 md:px-10 pt-14 pb-8">
        <div className="grid sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-display text-lg mb-2">Sara Stal</p>
            <p className="text-stone leading-relaxed max-w-[220px]">צילומי ילדים, משפחה וטבע</p>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="eyebrow text-stone mb-1">ניווט</p>
            <Link href="/#about" className="hover:text-olive transition-colors duration-300">עלי</Link>
            <Link href="/albums" className="hover:text-olive transition-colors duration-300">אלבומים</Link>
            <Link href="/#contact" className="hover:text-olive transition-colors duration-300">יצירת קשר</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="eyebrow text-stone mb-1">יצירת קשר</p>
            <span>{phone}</span>
            <span>{email}</span>
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-olive transition-colors duration-300"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
                אינסטגרם
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-mist mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
          <p>© {new Date().getFullYear()} · כל הזכויות שמורות</p>
          <p className="eyebrow">{credit}</p>
        </div>
      </div>
    </footer>
  );
}
