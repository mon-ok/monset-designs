import { ImageIcon } from 'lucide-react'
import CourtDiagram from './CourtDiagram.jsx'

/* Marks where the client's own photo goes. Shows the sport's court lines as a stand-in. */
export default function PhotoPlaceholder({ sport, label = 'Replace with a photo of your courts', className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-line bg-raised ${className}`}>
      <div className="flex h-full items-center justify-center p-10 sm:p-14">
        <CourtDiagram sport={sport} className="w-full max-w-md opacity-90" />
      </div>
      <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-bg/80 px-3 py-1.5 text-xs font-medium text-ink/75">
        <ImageIcon size={14} aria-hidden="true" />
        {label}
      </span>
    </div>
  )
}
