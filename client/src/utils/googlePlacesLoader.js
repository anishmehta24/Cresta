let loadingPromise = null

export function loadGooglePlaces() {
  if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
    return Promise.resolve(window.google)
  }
  if (loadingPromise) return loadingPromise
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY
  if (!apiKey) {
    return Promise.resolve(null) // no key, caller should fallback
  }
  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}&libraries=places&language=en`
    script.async = true
    script.onerror = () => { console.error('Failed to load Google Places script'); resolve(null) }
    script.onload = () => {
      if (window.google && window.google.maps && window.google.maps.places) resolve(window.google)
      else resolve(null)
    }
    document.head.appendChild(script)
  })
  return loadingPromise
}
