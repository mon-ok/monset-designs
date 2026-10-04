/*
  Top-down court line drawings, drawn to real proportions.
  Pickleball & badminton: 44 x 20 ft. Basketball: 94 x 50 ft.
  Colours come from palette roles via currentColor / fill classes.
*/

function Pickleball({ showLabels }) {
  // 10 units per foot
  return (
    <svg viewBox="-12 -12 464 250" className="h-auto w-full" role="img" aria-label="Pickleball court diagram">
      <rect x="150" y="0" width="140" height="200" className="fill-soft" />
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="0" y="0" width="440" height="200" />
        <line x1="150" y1="0" x2="150" y2="200" />
        <line x1="290" y1="0" x2="290" y2="200" />
        <line x1="0" y1="100" x2="150" y2="100" />
        <line x1="290" y1="100" x2="440" y2="100" />
      </g>
      <line x1="220" y1="-10" x2="220" y2="210" stroke="currentColor" strokeWidth="6" strokeDasharray="2 6" />
      <g className="fill-ball">
        <circle cx="352" cy="58" r="11" />
      </g>
      <g className="fill-soft">
        <circle cx="348" cy="55" r="1.8" />
        <circle cx="356" cy="55" r="1.8" />
        <circle cx="352" cy="62" r="1.8" />
      </g>
      {showLabels && (
        <g className="fill-current" fontSize="11" fontWeight="600">
          <text x="220" y="232" textAnchor="middle" opacity="0.85">
            Non-volley zone
          </text>
          <text x="75" y="56" textAnchor="middle" opacity="0.6">
            Service court
          </text>
          <text x="75" y="156" textAnchor="middle" opacity="0.6">
            Service court
          </text>
        </g>
      )}
    </svg>
  )
}

function Badminton() {
  return (
    <svg viewBox="-12 -12 464 224" className="h-auto w-full" role="img" aria-label="Badminton court diagram">
      <rect x="155" y="0" width="130" height="200" className="fill-soft" />
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="0" y="0" width="440" height="200" />
        <line x1="0" y1="15" x2="440" y2="15" />
        <line x1="0" y1="185" x2="440" y2="185" />
        <line x1="155" y1="0" x2="155" y2="200" />
        <line x1="285" y1="0" x2="285" y2="200" />
        <line x1="25" y1="0" x2="25" y2="200" />
        <line x1="415" y1="0" x2="415" y2="200" />
        <line x1="0" y1="100" x2="155" y2="100" />
        <line x1="285" y1="100" x2="440" y2="100" />
      </g>
      <line x1="220" y1="-10" x2="220" y2="210" stroke="currentColor" strokeWidth="6" strokeDasharray="2 6" />
    </svg>
  )
}

function Basketball() {
  // 5 units per foot
  return (
    <svg viewBox="-12 -12 494 274" className="h-auto w-full" role="img" aria-label="Basketball court diagram">
      <rect x="0" y="85" width="95" height="80" className="fill-soft" />
      <rect x="375" y="85" width="95" height="80" className="fill-soft" />
      <g fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="0" y="0" width="470" height="250" />
        <line x1="235" y1="0" x2="235" y2="250" />
        <circle cx="235" cy="125" r="30" />
        <rect x="0" y="85" width="95" height="80" />
        <rect x="375" y="85" width="95" height="80" />
        <circle cx="95" cy="125" r="30" />
        <circle cx="375" cy="125" r="30" />
        <path d="M0 15 H70 A118.75 118.75 0 0 1 70 235 H0" />
        <path d="M470 15 H400 A118.75 118.75 0 0 0 400 235 H470" />
      </g>
      <g className="fill-ball">
        <circle cx="26" cy="125" r="5" />
        <circle cx="444" cy="125" r="5" />
      </g>
    </svg>
  )
}

export default function CourtDiagram({ sport = 'pickleball', showLabels = false, color = 'text-accent', className = '' }) {
  return (
    <div className={`${color} ${className}`}>
      {sport === 'badminton' ? (
        <Badminton />
      ) : sport === 'basketball' ? (
        <Basketball />
      ) : (
        <Pickleball showLabels={showLabels} />
      )}
    </div>
  )
}
