import React, { useEffect } from 'react'
import { Html } from '@react-three/drei'
import { CONFIG, HTML_TRANSFORM_FACTOR } from '../config.js'
import { rig } from '../rig.js'
import { useStore } from '../store.js'

// A single semi-transparent glass "tech block" that appears beside the monitor.
// Positioned in world space (rig.panels[index]); the CameraRig glides to frame
// it. Only mounts its HTML while open, so the CSS entrance animation plays.
export default function TechPanel({ index, section, open }) {
  const setActiveSection = useStore((s) => s.setActiveSection)
  const p = rig.panels[index]

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setActiveSection(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setActiveSection])

  if (!p || !open) return null

  const [px] = CONFIG.panel.htmlPx
  const scale = (p.size.w / px) * HTML_TRANSFORM_FACTOR * CONFIG.panel.scale
  const { Icon } = section

  return (
    <group position={p.center} quaternion={rig.screenQuat}>
      {/* faint volume behind the HTML — sells the "projected block" */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[p.size.w * 1.05, p.size.h * 1.05]} />
        <meshBasicMaterial color="#6fa8ff" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      <Html transform scale={scale} zIndexRange={[9, 0]}>
        <div className="panel" style={{ width: px, height: CONFIG.panel.htmlPx[1] }}>
          <div className="panel-head">
            <div>
              <p className="eyebrow">Business Name Here</p>
              <h2>{section.title}</h2>
            </div>
            <button className="close" aria-label="Close" onClick={() => setActiveSection(null)}>×</button>
          </div>
          <p className="lede">{section.lede}</p>
          <p className="body">{section.body}</p>
          <div className="stats">
            {section.stats.map((s) => (
              <div className="stat" key={s.k}>
                <div className="k">{s.k}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  )
}
