import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { easing } from 'maath'
import { CONFIG, ease } from '../config.js'
import { rig, scroll } from '../rig.js'
import { useStore } from '../store.js'

// Drives the camera every frame:
//   - during the intro, interpolate hero -> monitor by (smoothed) scroll
//   - when a tech panel is open, fly to that panel's pose
// Damping (maath easing.damp3) adds the "smooth tracking" glide.
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const activeSection = useStore((s) => s.activeSection)
  const look = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const init = useRef(false)

  useFrame((_, dt) => {
    if (!rig.ready) return

    if (activeSection !== null && rig.panels[activeSection]) {
      const p = rig.panels[activeSection]
      targetPos.current.copy(p.pos)
      targetLook.current.copy(p.look)
    } else {
      const t = ease(scroll.smooth)
      targetPos.current.copy(rig.hero.pos).lerp(rig.monitor.pos, t)
      targetLook.current.copy(rig.hero.look).lerp(rig.monitor.look, t)
    }

    if (!init.current) {
      camera.position.copy(targetPos.current)
      look.current.copy(targetLook.current)
      init.current = true
    }

    easing.damp3(camera.position, targetPos.current, CONFIG.smooth.camera, dt)
    easing.damp3(look.current, targetLook.current, CONFIG.smooth.look, dt)
    camera.lookAt(look.current)
  })

  return null
}
