import React, { Suspense } from 'react'
import { Environment, ContactShadows } from '@react-three/drei'
import DeskModel from './DeskModel.jsx'
import CameraRig from './CameraRig.jsx'
import Ticker from './Ticker.jsx'
import TechPanel from './TechPanel.jsx'
import { useStore } from '../store.js'
import { rig } from '../rig.js'
import { SECTIONS } from '../sections.jsx'

export default function Experience() {
  const posesReady = useStore((s) => s.posesReady)
  const activeSection = useStore((s) => s.activeSection)

  return (
    <>
      <Ticker />
      <CameraRig />

      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 6, -4]} intensity={2.2} castShadow />
      <directionalLight position={[-4, 3, 3]} intensity={0.6} />

      <Suspense fallback={null}>
        <DeskModel />
        {/* City HDRI for realistic glass/metal reflections. Fetched from the
            drei asset CDN on first load; needs internet the first run. */}
        <Environment preset="city" background={false} />
      </Suspense>

      {posesReady && (
        <ContactShadows
          position={[rig.sceneCenter.x, rig.floorY + 0.001, rig.sceneCenter.z]}
          scale={Math.max(rig.sceneSize.x, rig.sceneSize.z) * 2.2}
          opacity={0.5}
          blur={2.6}
          far={rig.sceneSize.y}
        />
      )}

      {posesReady &&
        SECTIONS.map((s, i) => (
          <TechPanel key={s.id} index={i} section={s} open={activeSection === i} />
        ))}
    </>
  )
}
