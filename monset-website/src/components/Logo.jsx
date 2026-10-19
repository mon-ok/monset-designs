// Monset mark, traced from logoblacktransparent.png: two slanted peaks.
export function MonsetMark({ className = "", light = true }) {
  const a = light ? "#e9eef5" : "#0a1b2e";
  const b = light ? "#6f98c4" : "#1b3a5a";
  const line = light ? "rgba(233,238,245,.42)" : "rgba(10,27,46,.32)";
  return (
    <svg viewBox="80 95 945 875" className={className} aria-hidden="true">
      <path d="M298 380 637 955M587 107l426 853" stroke={line} strokeWidth="14" fill="none" />
      <polygon fill={a} points="301,390 362,505 159,948 90,830" />
      <polygon fill={b} points="565,122 625,230 432,627 368,505" />
    </svg>
  );
}

export function Wordmark({ className = "" }) {
  return (
    <span className={`font-extrabold tracking-[-0.02em] ${className}`} style={{ fontStretch: "108%" }}>
      Monset<span className="text-contour">.co</span>
    </span>
  );
}
