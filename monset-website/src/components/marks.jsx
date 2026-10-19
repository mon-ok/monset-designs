// Survey marks shared across sections.

export function Benchmark({ className = "" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className={className} aria-hidden="true">
      <circle cx="9" cy="9" r="7" fill="none" stroke="var(--color-pin)" strokeWidth="2" />
      <path d="M9 4v10M4 9h10" stroke="var(--color-pin)" strokeWidth="1.6" />
    </svg>
  );
}

export function Arrow({ className = "", down = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {down ? <path d="M8 2v12M3 9l5 5 5-5" /> : <path d="M2 8h12M9 3l5 5-5 5" />}
    </svg>
  );
}

export function External({ className = "" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 10l6-6M5 4h5v5" />
    </svg>
  );
}

export function SectionHead({ title, note, dark = false }) {
  return (
    <header className="max-w-[46rem]">
      <h2 className={`display text-[clamp(2rem,3.6vw,3.4rem)] ${dark ? "text-film" : "text-ink"}`}>{title}</h2>
      {note && (
        <p className={`mt-5 text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed ${dark ? "text-mist" : "text-ink-soft"}`}>
          {note}
        </p>
      )}
    </header>
  );
}

export const wrap = "mx-auto w-full max-w-[84rem] px-5 sm:px-8";
export const band = "py-[clamp(4.5rem,9vw,8rem)]";
