import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { SITE } from '../../config/site.js'
import LampBar from '../board/LampBar.jsx'
import { Seg } from '../board/Board.jsx'
import { Ball, Paddle } from './PaddleRig.jsx'

const TRAVEL = [0.77, 0, 0.175, 1]

/*
  Pro loader. A pickleball bounces on a paddle (CSS keyframes, looping)
  until loading completes. Then it takes one higher bounce and, at the top,
  flies to the header where its logo lands in the logo slot.
  Business name and progress sit on a layer above the rig.
*/
export default function LoaderPro({ onDone, duration = 5000 }) {
  const reduce = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loop') // loop | final | fly
  const loadedRef = useRef(false)
  const flyRef = useRef(null)
  const bounceRef = useRef(null)
  const logoRef = useRef(null)
  const bodyRef = useRef(null)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  // Progress, fixed at the standard 5 seconds
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setProgress(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        loadedRef.current = true
        if (reduce) {
          setPhase('fly')
          setTimeout(() => doneRef.current(), 350)
        }
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration, reduce])

  // Loading finished: switch to the final bounce at the next paddle contact
  const onIteration = (e) => {
    if (e.target !== e.currentTarget) return
    if (loadedRef.current && phase === 'loop') setPhase('final')
  }

  // Top of the final bounce: fly the logo into the header slot
  const onFinalEnd = async (e) => {
    if (e.target !== e.currentTarget || e.animationName !== 'pro-final' || phase !== 'final') return
    setPhase('fly')
    const src = logoRef.current?.getBoundingClientRect()
    const dst = document.getElementById('header-logo-slot')?.getBoundingClientRect()
    if (!src || !dst || !dst.width) {
      doneRef.current()
      return
    }
    const x = dst.left + dst.width / 2 - (src.left + src.width / 2)
    const y = dst.top + dst.height / 2 - (src.top + src.height / 2)
    const scale = dst.width / src.width
    animate(bodyRef.current, { opacity: 0, scale: 0.6 }, { duration: 0.45, ease: [0.4, 0, 1, 1] })
    await animate(flyRef.current, { x, y, scale }, { duration: 0.85, ease: TRAVEL })
    doneRef.current()
  }

  const pct = Math.round(progress * 100)
  const leaving = phase === 'fly'

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="status" aria-live="polite">
      {/* Stage */}
      <motion.div
        className="loader-stage absolute inset-0"
        initial={false}
        animate={{ opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.6, delay: leaving ? 0.3 : 0, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(60% 45% at 50% 0%, color-mix(in srgb, var(--c-lamp) 18%, transparent), transparent 70%)' }}
        />
        <div className="matte-noise" />
      </motion.div>

      {/* Rig: occupies the lower three quarters, behind the text layer */}
      <div className="pro-rig absolute inset-x-0 bottom-0 top-1/4 z-0">
        <div className="absolute inset-x-0 bottom-[9%] flex flex-col items-center">
          {/* Ball with its ground shadow; the outer wrapper is what flies */}
          <div ref={flyRef} className="relative z-10 -mb-3">
            <div
              ref={bounceRef}
              className={phase === 'loop' && !reduce ? 'pro-ball-bounce' : phase === 'final' ? 'pro-final' : ''}
              onAnimationIteration={onIteration}
              onAnimationEnd={onFinalEnd}
              style={phase === 'fly' ? { transform: 'translateY(calc(var(--bounce-h) * -1.15))' } : undefined}
            >
              <div className={phase === 'loop' && !reduce ? 'pro-ball-squash' : phase === 'final' ? 'pro-squash-once' : ''}>
                <Ball logoRef={logoRef} bodyRef={bodyRef} spin={!reduce} />
              </div>
            </div>
          </div>
          <motion.div
            className="relative"
            animate={{ opacity: leaving ? 0 : 1, y: leaving ? 16 : 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
          >
            <span
              className={`pro-shadow absolute left-1/2 top-[34%] h-5 w-20 -translate-x-1/2 rounded-full bg-black/45 blur-[6px] ${phase === 'loop' && !reduce ? '' : 'pro-shadow-still'}`}
            />
            <div className={phase === 'loop' && !reduce ? 'pro-paddle' : ''}>
              <Paddle />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Branding layer: above the rig, above centre */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-[11%] z-20 flex flex-col items-center px-6 text-center text-on-stage"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? -10 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 1, 1] }}
      >
        <p className="display text-[clamp(3rem,9vw,6rem)]">{SITE.businessName}</p>
        <p className="mt-3 text-base text-on-stage/70 sm:text-lg">{SITE.headline}</p>
        <LampBar progress={progress} className="mt-7 w-56" />
        <Seg value={String(pct).padStart(3, '0')} label={`${pct}% loaded`} className="mt-3 text-base" />
      </motion.div>
    </div>
  )
}
