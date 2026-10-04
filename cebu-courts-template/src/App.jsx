import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useShowcase } from './context/ShowcaseContext.jsx'
import Loader from './components/Loader.jsx'
import LoaderIntermediate from './components/intermediate/LoaderIntermediate.jsx'
import ShowcasePanel from './components/ShowcasePanel.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import CartButton from './components/CartButton.jsx'
import ComingSoon from './pages/ComingSoon.jsx'
import Landing from './pages/Landing.jsx'
import Booking from './pages/Booking.jsx'
import IntermediateLanding from './pages/IntermediateLanding.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    // Header links like /#amenities: wait for the page to render, then scroll
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60)
    return () => clearTimeout(t)
  }, [pathname, hash])
  return null
}

export default function App() {
  const { tier, loading, loaderKey, finishLoading } = useShowcase()

  return (
    <>
      <ScrollToTop />

      <div aria-hidden={loading}>
        {tier === 'basic' && (
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        )}
        {tier === 'intermediate' && (
          <Routes>
            <Route path="/" element={<IntermediateLanding />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="*" element={<IntermediateLanding />} />
          </Routes>
        )}
        {tier === 'pro' && <ComingSoon tier={tier} />}
      </div>

      {tier !== 'pro' && (
        <>
          <CartButton />
          <CartDrawer />
        </>
      )}

      {loading &&
        (tier === 'intermediate' ? (
          <LoaderIntermediate key={loaderKey} onDone={finishLoading} />
        ) : (
          <Loader key={loaderKey} onDone={finishLoading} />
        ))}

      <ShowcasePanel />
    </>
  )
}
