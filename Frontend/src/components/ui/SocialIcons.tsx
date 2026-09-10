// Minimal, original glyphs representing each social channel — not copies of any
// platform's trademarked logo.

export function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 9.5h1.6V7.2h-1.9c-1.7 0-2.6.98-2.6 2.6v1.3H8.9v2.2h1.7v4.9h2.3v-4.9h1.8l.3-2.2h-2.1V10c0-.34.2-.5.6-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.6v4.8l4.3-2.4-4.3-2.4Z" fill="currentColor" />
    </svg>
  );
}

export function TiktokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M14 3.5c.4 2.1 1.9 3.5 4 3.7v2.4a6.4 6.4 0 0 1-4-1.4v6.3a4.85 4.85 0 1 1-4-4.77v2.5a2.35 2.35 0 1 0 1.6 2.27V3.5H14Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
