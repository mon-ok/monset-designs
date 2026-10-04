import { useShowcase, TIERS } from '../context/ShowcaseContext.jsx'
import { LogoMark } from '../components/Brand.jsx'
import Button from '../components/Button.jsx'

const PREVIEWS = {
  pro: ['Scope to be defined in the Pro brief'],
}

export default function ComingSoon({ tier }) {
  const { setTier } = useShowcase()
  const label = TIERS.find((t) => t.id === tier)?.label

  return (
    <main className="flex min-h-screen items-center bg-bg px-6 py-20">
      <div className="mx-auto w-full max-w-xl lg:pl-10">
        <LogoMark size="lg" />
        <h1 className="display mt-8 text-5xl">{label} preview is on the way.</h1>
        <p className="mt-5 text-lg text-ink/70">This package is still being built. Here's what it adds on top of Intermediate:</p>
        <ul className="mt-6 space-y-3">
          {PREVIEWS[tier].map((item) => (
            <li key={item} className="flex gap-3 border-b border-line pb-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
        <Button className="mt-10" onClick={() => setTier('basic')}>
          View the Basic package
        </Button>
      </div>
    </main>
  )
}
