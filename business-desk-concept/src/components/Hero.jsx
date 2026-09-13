import React, { useEffect, useRef } from 'react'
import { scroll } from '../rig.js'
import { useStore } from '../store.js'

// DOM overlay hero. Fades + drifts up as the intro zoom begins. Reads the
// smoothed scroll value directly in a rAF loop (no React re-renders per frame).
export default function Hero({ onStart }) {
  const heroRef = useRef(null)
  const hintRef = useRef(null)
  const loaded = useStore((s) => s.loaded)

  useEffect(() => {
    let raf
    const tick = () => {
      const o = Math.max(0, 1 - scroll.smooth * 2.2) // gone by ~45% scroll
      if (heroRef.current) {
        heroRef.current.style.opacity = o
        heroRef.current.style.transform = `translateY(${-scroll.smooth * 40}px)`
        heroRef.current.style.pointerEvents = o < 0.05 ? 'none' : 'auto'
      }
      if (hintRef.current) hintRef.current.style.opacity = o
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div ref={heroRef} className="hero" style={{ opacity: 0 }}>
        <div className="hero-inner">
          <h1>Business Name Here</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.</p>
          <button className="cta" onClick={onStart} disabled={!loaded}>Let’s get started</button>
        </div>
      </div>
      <div ref={hintRef} className="scroll-hint" style={{ opacity: 0 }}>
        <span>Scroll to sit down</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  )
}
