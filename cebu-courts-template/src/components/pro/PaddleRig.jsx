/* Drawn parts for the Pro loader: a pickleball (holes spin, logo stays upright) and a paddle in three-quarter view. */
import { LogoMark } from '../Brand.jsx'

const HOLES = [
  [50, 18], [27, 30], [73, 30], [16, 52], [84, 52], [27, 74], [73, 74], [50, 86], [38, 50], [62, 50], [50, 34], [50, 66],
]

export function Ball({ logoRef, bodyRef, spin = true }) {
  return (
    <div className="relative h-24 w-24">
      {/* Ball body: fades away during the fly so only the logo lands */}
      <div ref={bodyRef} className="absolute inset-0 rounded-full" style={{ background: 'var(--c-lamp)' }}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.45), transparent 42%), radial-gradient(circle at 70% 78%, rgb(0 0 0 / 0.28), transparent 55%)',
          }}
        />
        <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full ${spin ? 'pro-ball-spin' : ''}`} aria-hidden="true">
          {HOLES.map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4.2" fill="rgb(0 0 0 / 0.22)" />
          ))}
        </svg>
      </div>
      {/* The client's logo rides on the ball and is what lands in the header */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span ref={logoRef} className="inline-flex text-stage">
          <LogoMark size="md" tone="current" />
        </span>
      </div>
    </div>
  )
}

export function Paddle() {
  // Three-quarter view: a rounded square face, foreshortened, with the grip coming toward you
  return (
    <svg viewBox="0 0 360 250" className="w-[min(80vw,380px)]" aria-hidden="true">
      <path d="M156 128 L204 128 L216 244 Q180 252 144 244 Z" fill="color-mix(in srgb, var(--c-flip-a), black 40%)" />
      {[150, 172, 194, 216, 236].map((y, i) => (
        <path
          key={y}
          d={`M${152 - i * 2} ${y + 6} L${208 + i * 2} ${y - 6}`}
          stroke="color-mix(in srgb, var(--c-flip-a), black 62%)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
      <rect x="138" y="118" width="84" height="18" rx="6" fill="color-mix(in srgb, var(--c-flip-a), black 55%)" />
      <rect x="14" y="26" width="332" height="108" rx="54" fill="color-mix(in srgb, var(--c-stage), black 35%)" />
      <rect x="14" y="18" width="332" height="108" rx="54" fill="var(--c-flip-a)" />
      <rect x="14" y="18" width="332" height="108" rx="54" fill="none" stroke="color-mix(in srgb, var(--c-stage), black 25%)" strokeWidth="9" />
      <rect x="64" y="34" width="150" height="22" rx="11" fill="rgb(255 255 255 / 0.12)" />
    </svg>
  )
}
