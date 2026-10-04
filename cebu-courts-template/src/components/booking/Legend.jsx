import { STATUS } from '../../data/availability.js'

export default function Legend({ className = '' }) {
  return (
    <div className={className}>
      <p className="text-sm font-semibold">Availability</p>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1">
        {Object.entries(STATUS).map(([key, s]) => (
          <li key={key} className="flex items-start gap-3">
            <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden="true" />
            <span>
              <span className="block text-sm font-medium leading-tight">{s.label}</span>
              <span className="block text-xs text-ink/60">{s.range}</span>
            </span>
          </li>
        ))}
        <li className="flex items-start gap-3">
          <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border border-ink/30" aria-hidden="true" />
          <span>
            <span className="block text-sm font-medium leading-tight">Unavailable</span>
            <span className="block text-xs text-ink/60">Past or not yet open</span>
          </span>
        </li>
      </ul>
    </div>
  )
}
