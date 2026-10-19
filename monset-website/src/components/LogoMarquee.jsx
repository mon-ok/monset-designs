// Tools strip as a slow marquee (the idea of VengeanceUI's logo-slider, whose published
// entry ships without its CSS, so the motion is written here). Two copies of the list
// slide by exactly one copy's width, so the loop has no seam.
export default function LogoMarquee({ items }) {
  const row = (hidden) => (
    <ul className="marquee-row flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t.name} className="flex items-center gap-2.5 whitespace-nowrap text-[1rem] font-semibold">
          <img src={t.logo} alt="" width="28" height="28" className="h-7 w-7 object-contain" />
          {t.name}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee group relative overflow-hidden py-2">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
