import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CONFIG, ease } from '../config.js'
import { rig, scroll } from '../rig.js'
import { useStore } from '../store.js'
import ScreenUI from './ScreenUI.jsx'

const MODEL = '/models/full_desk_opt.glb'
const Z = new THREE.Vector3(0, 0, 1)
const UP = new THREE.Vector3(0, 1, 0)

export default function DeskModel() {
  const { scene } = useGLTF(MODEL) // drei auto-configures the Draco decoder
  const chairRef = useRef(null)
  const chairBase = useRef({ pos: new THREE.Vector3(), rotY: 0, size: new THREE.Vector3(1, 1, 1) })
  const [ready, setReady] = useState(false)

  const setPosesReady = useStore((s) => s.setPosesReady)
  const setLoaded = useStore((s) => s.setLoaded)

  useEffect(() => {
    scene.traverse((o) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true }
    })
    scene.updateMatrixWorld(true)

    const monitor = scene.getObjectByName('monitor_27')
    const chair = scene.getObjectByName('ikea_markus.001')

    // --- measure ---------------------------------------------------------
    const sceneBox = new THREE.Box3().setFromObject(scene)
    sceneBox.getCenter(rig.sceneCenter)
    sceneBox.getSize(rig.sceneSize)
    rig.floorY = sceneBox.min.y

    const mBox = new THREE.Box3().setFromObject(monitor)
    mBox.getCenter(rig.monitorCenter)
    mBox.getSize(rig.monitorSize)

    // Front = from monitor toward the chair (i.e. toward the viewer), flattened.
    const front = new THREE.Vector3(0, 0, -1)
    if (chair) {
      const cc = new THREE.Vector3()
      new THREE.Box3().setFromObject(chair).getCenter(cc)
      front.copy(cc).sub(rig.monitorCenter)
    }
    front.y = 0
    if (front.lengthSq() < 1e-6) front.set(0, 0, -1)
    front.normalize()
    rig.frontDir.copy(front)
    rig.rightDir.copy(new THREE.Vector3().crossVectors(UP, front).normalize())
    rig.up.copy(UP)
    rig.screenQuat.setFromUnitVectors(Z, front)

    // Screen rectangle (trim bezel/stand off the monitor bbox).
    const s = rig.monitorSize
    const screenW = Math.abs(s.x * rig.rightDir.x) + Math.abs(s.z * rig.rightDir.z)
    rig.screenSize.set(screenW * CONFIG.screen.widthFactor, s.y * CONFIG.screen.heightFactor)
    rig.screenCenter
      .copy(rig.monitorCenter)
      .addScaledVector(UP, s.y * CONFIG.screen.yLift)
      .addScaledVector(front, CONFIG.screen.forward)

    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(CONFIG.camera.fov) / 2)

    // --- monitor (docked) pose ------------------------------------------
    const dMon = rig.screenSize.y / (2 * tanHalfFov * CONFIG.screenFill)
    rig.monitor.pos.copy(rig.screenCenter).addScaledVector(front, dMon)
    rig.monitor.look.copy(rig.screenCenter)

    // --- hero (wide) pose -----------------------------------------------
    const heroDist = Math.max(rig.sceneSize.x, rig.sceneSize.z) * CONFIG.hero.distMul
    rig.hero.pos
      .copy(rig.sceneCenter)
      .addScaledVector(front, heroDist)
      .addScaledVector(UP, rig.sceneSize.y * CONFIG.hero.heightMul)
    rig.hero.look.copy(rig.sceneCenter).addScaledVector(UP, rig.sceneSize.y * CONFIG.hero.lookHeightMul)

    // --- tech panel poses (to the side of the monitor) -------------------
    const monitorW = screenW
    const panelH = s.y * CONFIG.panel.heightMul
    const panelW = panelH * CONFIG.panel.aspect
    const dPanel = panelH / (2 * tanHalfFov * CONFIG.panel.fill)
    rig.panels = [0, 1, 2].map(() => {
      const center = new THREE.Vector3()
        .copy(rig.monitorCenter)
        .addScaledVector(rig.rightDir, CONFIG.panel.side * monitorW * CONFIG.panel.offsetMul)
        .addScaledVector(front, monitorW * CONFIG.panel.forward)
      const pos = new THREE.Vector3().copy(center).addScaledVector(front, dPanel)
      return { center, pos, look: center.clone(), size: { w: panelW, h: panelH } }
    })

    // stash chair rest state
    if (chair) {
      chairRef.current = chair
      chairBase.current.pos.copy(chair.position)
      chairBase.current.rotY = chair.rotation.y
      new THREE.Box3().setFromObject(chair).getSize(chairBase.current.size)
    }

    rig.ready = true
    setReady(true)
    setPosesReady(true)
    // allow one frame for the camera rig to snap into place, then reveal
    requestAnimationFrame(() => setLoaded(true))
  }, [scene, setPosesReady, setLoaded])

  // Chair slides + turns out of the way as the intro zoom progresses.
  useFrame(() => {
    const chair = chairRef.current
    if (!chair) return
    const t = ease(scroll.smooth)
    const b = chairBase.current
    chair.position.set(
      b.pos.x + CONFIG.chair.slide[0] * b.size.x * t,
      b.pos.y + CONFIG.chair.slide[1] * b.size.y * t,
      b.pos.z + CONFIG.chair.slide[2] * b.size.z * t
    )
    chair.rotation.y = b.rotY + CONFIG.chair.turnY * t
  })

  return (
    <group>
      <primitive object={scene} />
      {ready && <ScreenUI />}
      {ready && CONFIG.DEBUG && <DebugRects />}
    </group>
  )
}

// Wireframe helpers to align the HTML overlays with the real geometry.
function DebugRects() {
  return (
    <>
      <axesHelper args={[Math.max(rig.sceneSize.x, rig.sceneSize.y)]} />
      <mesh position={rig.screenCenter} quaternion={rig.screenQuat}>
        <planeGeometry args={[rig.screenSize.x, rig.screenSize.y]} />
        <meshBasicMaterial color="#00ffcc" wireframe />
      </mesh>
      {rig.panels.map((p, i) => (
        <mesh key={i} position={p.center} quaternion={rig.screenQuat}>
          <planeGeometry args={[p.size.w, p.size.h]} />
          <meshBasicMaterial color="#ff5599" wireframe />
        </mesh>
      ))}
    </>
  )
}

useGLTF.preload(MODEL)
