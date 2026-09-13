import { useFrame } from '@react-three/fiber'
import { CONFIG } from '../config.js'
import { scroll } from '../rig.js'
import { useStore } from '../store.js'

// One place that advances the smoothed scroll value each frame + flips the
// "docked" flag. Kept out of React state to avoid per-frame re-renders.
export default function Ticker() {
  const setDocked = useStore.getState().setDocked
  useFrame((_, dt) => {
    const k = 1 - Math.pow(0.0001, dt / CONFIG.smooth.scroll) // frame-rate independent lerp
    scroll.smooth += (scroll.target - scroll.smooth) * k
    setDocked(scroll.smooth > 0.92)
  })
  return null
}
