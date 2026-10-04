import { ImageIcon } from 'lucide-react'
import CourtDiagram from '../CourtDiagram.jsx'

/*
  Stand-in for a real photo. Dark stage ground, a faint court drawing,
  and a clear label so buyers know an image belongs here.
*/
export default function PhotoSlot({ sport, label, centered = false, diagram = true, className = '' }) {
  return (
    <div className={`photo-stripes relative overflow-hidden bg-stage text-on-stage ${className}`}>
      {diagram && (
        <div className="absolute inset-0 flex items-center justify-center p-[8%]">
          <CourtDiagram sport={sport} color="text-on-stage" className="w-full max-w-2xl opacity-[0.16]" />
        </div>
      )}

      {centered ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-on-stage/10 ring-1 ring-on-stage/20">
            <ImageIcon size={20} aria-hidden="true" />
          </span>
          <span className="text-xs font-medium opacity-75">{label}</span>
        </div>
      ) : (
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-on-stage/10 px-3 py-1.5 text-xs font-medium ring-1 ring-on-stage/15 backdrop-blur-sm">
          <ImageIcon size={14} aria-hidden="true" />
          {label}
        </span>
      )}
    </div>
  )
}
