import React, { useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CONFIG, HTML_TRANSFORM_FACTOR } from '../config.js'
import { rig, scroll } from '../rig.js'
import { useStore } from '../store.js'
import { SECTIONS } from '../sections.jsx'

// The interactive "OS" that lives on the monitor screen. Rendered as real,
// clickable HTML mapped into the screen plane via <Html transform>.
export default function ScreenUI() {
  const rootRef = useRef(null)
  const activeSection = useStore((s) => s.activeSection)
  const setActiveSection = useStore((s) => s.setActiveSection)
  const [px, py] = CONFIG.screen.htmlPx

  // map the div's px onto the measured screen rect (see HTML_TRANSFORM_FACTOR)
  const scale = (rig.screenSize.x / px) * HTML_TRANSFORM_FACTOR * CONFIG.screen.scale

  // Fade the UI in over the back half of the intro; only clickable when docked.
  useFrame(() => {
    const el = rootRef.current
    if (!el) return
    const o = Math.min(1, Math.max(0, (scroll.smooth - 0.55) / 0.35))
    el.style.opacity = o
    el.style.pointerEvents = scroll.smooth > 0.9 ? 'auto' : 'none'
  })

  const [clock, setClock] = useClock()
  useEffect(() => {}, [clock])

  return (
    <group position={rig.screenCenter} quaternion={rig.screenQuat}>
      <Html transform scale={scale} zIndexRange={[10, 0]} occlude={false}>
        <div
          ref={rootRef}
          className="screen"
          style={{ width: px, height: py, opacity: 0 }}
        >
          <div className="screen-bar">
            <span className="brand">Business Name Here</span>
            <span className="clock">{clock}</span>
          </div>
          <div className="screen-body">
            <span className="greeting">Choose where to go</span>
            <div className="apps">
              {SECTIONS.map((s, i) => (
                <button
                  key={s.id}
                  className={'app' + (activeSection === i ? ' active' : '')}
                  onClick={() => setActiveSection(i)}
                >
                  <span className="glyph"><s.Icon /></span>
                  <span className="label">{s.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

function useClock() {
  const [t, setT] = React.useState(() => now())
  React.useEffect(() => {
    const id = setInterval(() => setT(now()), 1000 * 20)
    return () => clearInterval(id)
  }, [])
  return [t, setT]
}
const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
