const STORAGE_KEY = 'cresta_recent_locations_v1'
const MAX = 5

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX))) } catch {}
}

export function addLocation(label) {
  if (!label || typeof label !== 'string') return
  const trimmed = label.trim()
  if (!trimmed) return
  const list = load().filter(l => l.toLowerCase() !== trimmed.toLowerCase())
  list.unshift(trimmed)
  save(list)
}

export function getRecentLocations() {
  return load()
}

export function clearRecentLocations() { try { localStorage.removeItem(STORAGE_KEY) } catch {} }
