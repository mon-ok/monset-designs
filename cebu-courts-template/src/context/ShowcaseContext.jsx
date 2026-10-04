import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { palettes, applyPalette } from '../theme/palettes.js'

export const TIERS = [
  { id: 'basic', label: 'Basic' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'pro', label: 'Pro' },
]

const ShowcaseContext = createContext(null)

export function ShowcaseProvider({ children }) {
  const [tier, setTierState] = useState('basic')
  const [paletteId, setPaletteId] = useState('p3')
  const [loading, setLoading] = useState(true)
  const [loaderKey, setLoaderKey] = useState(0)

  const palette = useMemo(() => palettes.find((p) => p.id === paletteId) ?? palettes[0], [paletteId])

  useLayoutEffect(() => {
    applyPalette(palette)
  }, [palette])

  // Lock page scroll while the loader is up
  useLayoutEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  const replayLoader = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setLoading(true)
    setLoaderKey((k) => k + 1)
  }, [])

  const finishLoading = useCallback(() => {
    setLoading(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const setTier = useCallback(
    (next) => {
      if (next === tier) return
      setTierState(next)
      replayLoader() // show off each tier's loader
    },
    [tier, replayLoader]
  )

  const value = {
    tier,
    setTier,
    palette,
    paletteId,
    setPaletteId,
    loading,
    loaderKey,
    replayLoader,
    finishLoading,
  }

  return <ShowcaseContext.Provider value={value}>{children}</ShowcaseContext.Provider>
}

export const useShowcase = () => useContext(ShowcaseContext)
