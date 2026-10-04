import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export const slotId = ({ sportId, dateKey, hour, courtId }) => `${sportId}|${dateKey}|${hour}|${courtId}`

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const has = useCallback((id) => items.some((i) => i.id === id), [items])

  const toggle = useCallback((item) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]
    )
  }, [])

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) => a.dateKey.localeCompare(b.dateKey) || a.hour - b.hour || a.courtName.localeCompare(b.courtName)
      ),
    [items]
  )

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items])

  const value = { items: sorted, count: items.length, total, has, toggle, remove, clear, open, setOpen }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
