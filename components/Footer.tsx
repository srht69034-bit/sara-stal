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
    <footer className="border-t border-mist mt-32">
      <div className="mx-auto max-w-editorial px-8 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone">
        <p>© {new Date().getFullYear()} · כל הזכויות שמורות</p>

        <div className="flex items-center gap-6">
          <span>{phone}</span>
          <span>{email}</span>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="אינסטגרם"
              className="hover:text-olive transition-colors duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            </a>
          )}
        </div>

        <p className="eyebrow">{credit}</p>
      </div>
    </footer>
  );
}
