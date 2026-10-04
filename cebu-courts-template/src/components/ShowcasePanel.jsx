import { useState } from 'react'
import { ChevronLeft, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { useShowcase, TIERS } from '../context/ShowcaseContext.jsx'
import { palettes } from '../theme/palettes.js'

/*
  Showcase controls. Styled neutral on purpose so it never picks up the
  site's palette and always reads as a preview tool, not part of the template.
*/
export default function ShowcasePanel() {
  const { tier, setTier, paletteId, setPaletteId, replayLoader } = useShowcase()
  const [open, setOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1536)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-2 rounded-r-xl bg-neutral-900 px-2.5 py-4 text-white shadow-xl ring-1 ring-white/10 hover:bg-neutral-800"
        aria-label="Open showcase controls"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span className="text-xs font-semibold [writing-mode:vertical-rl] rotate-180">Showcase</span>
      </button>
    )
  }

  return (
    <aside
      className="fixed left-0 top-1/2 z-[60] w-[19rem] max-w-[calc(100vw-1rem)] -translate-y-1/2 rounded-r-2xl bg-neutral-900/95 p-5 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur"
      aria-label="Showcase controls"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Template showcase</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Collapse showcase controls"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
      </div>

      <fieldset className="mt-5">
        <legend className="text-xs font-medium text-white/60">Package</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-white/10 p-1" role="radiogroup">
          {TIERS.map((t) => {
            const active = t.id === tier
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTier(t.id)}
                className={`rounded-full px-2 py-2 text-xs font-semibold ${
                  active ? 'bg-white text-neutral-900' : 'text-white/75 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-xs font-medium text-white/60">Colour palette</legend>
        <div className="mt-2 space-y-1.5" role="radiogroup">
          {palettes.map((p) => {
            const active = p.id === paletteId
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPaletteId(p.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left ${
                  active ? 'bg-white/15 ring-1 ring-white/40' : 'hover:bg-white/8'
                }`}
              >
                <span className="text-sm">
                  {p.name}
                  <span className="ml-2 text-xs text-white/50">{p.mode === 'dark' ? 'Dark' : 'Light'}</span>
                </span>
                <span className="flex">
                  {p.swatch.map((c) => (
                    <span
                      key={c}
                      className="-ml-1 h-5 w-5 rounded-full ring-2 ring-neutral-900 first:ml-0"
                      style={{ background: c }}
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={replayLoader}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-xs font-semibold text-white/85 hover:bg-white/10"
      >
        <RotateCcw size={14} aria-hidden="true" />
        Replay loading screen
      </button>

      <p className="mt-4 text-[0.7rem] leading-relaxed text-white/45">
        Preview controls only. They aren't included in the delivered website.
      </p>
    </aside>
  )
}
