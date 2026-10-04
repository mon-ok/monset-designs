export const pad = (n) => String(n).padStart(2, '0')

export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export const todayKey = () => toKey(new Date())

export const formatHour = (h) => {
  const hr = h % 12 === 0 ? 12 : h % 12
  return `${hr}:00 ${h < 12 || h === 24 ? 'AM' : 'PM'}`
}

export const formatRange = (h) => `${formatHour(h)} – ${formatHour(h + 1)}`

export const formatLongDate = (key) =>
  fromKey(key).toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })

export const formatShortDate = (key) =>
  fromKey(key).toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })

export const formatMonth = (date) => date.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })

const pesoFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
})
export const peso = (n) => pesoFormatter.format(n)
