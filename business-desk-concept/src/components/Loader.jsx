import React from 'react'
import { useProgress } from '@react-three/drei'
import { useStore } from '../store.js'

export default function Loader() {
  const { progress } = useProgress()
  const loaded = useStore((s) => s.loaded)
  return (
    <div className={'loader' + (loaded ? ' hidden' : '')}>
      <div className="ring" />
      <div className="pct">{Math.round(progress)}%</div>
    </div>
  )
}
