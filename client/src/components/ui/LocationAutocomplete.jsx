import { useEffect, useRef, useState } from 'react'
import { loadGooglePlaces } from '../../utils/googlePlacesLoader'

const DEBOUNCE = 300

export default function LocationAutocomplete({ label, value, onChange, onSelect, placeholder='Start typing location', name, required }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(null)
  const [predictions, setPredictions] = useState([])
  const [open, setOpen] = useState(false)
  const serviceRef = useRef(null)
  const placesDetailsRef = useRef(null)
  const timerRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(()=>{
    let active = true
    loadGooglePlaces().then(g => {
      if (!active) return
      if (g && g.maps && g.maps.places) {
        serviceRef.current = new g.maps.places.AutocompleteService()
        placesDetailsRef.current = new g.maps.places.PlacesService(document.createElement('div'))
        setReady(true)
      } else {
        setReady(false)
      }
    }).catch(e=>{ console.error(e); setError('Places unavailable') })
    return () => { active = false }
  }, [])

  useEffect(()=>{
    if (!ready || !serviceRef.current) return
    if (!value || value.length < 3) { setPredictions([]); return }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(()=>{
      serviceRef.current.getPlacePredictions({ input: value }, (res, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !res) {
          setPredictions([])
          return
        }
        setPredictions(res.slice(0,6))
      })
    }, DEBOUNCE)
  }, [value, ready])

  useEffect(()=>{
    const handler = (e) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return ()=>document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (p) => {
    onChange({ target: { name, value: p.description } })
    if (placesDetailsRef.current && window.google) {
      placesDetailsRef.current.getDetails({ placeId: p.place_id, fields: ['formatted_address','geometry'] }, (details, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
          const lng = details.geometry?.location?.lng?.()
          const lat = details.geometry?.location?.lat?.()
          if (onSelect && lng !== undefined && lat !== undefined) {
            // Pass in [lng, lat] per backend schema
            onSelect({ name, address: details.formatted_address || p.description, coords: [lng, lat] })
          } else if (onSelect) {
            onSelect({ name, address: p.description, coords: null })
          }
        } else if (onSelect) {
          onSelect({ name, address: p.description, coords: null })
        }
      })
    } else if (onSelect) {
      onSelect({ name, address: p.description, coords: null })
    }
    setOpen(false)
  }

  const showDropdown = open && predictions.length > 0

  return (
    <label className="block relative" ref={containerRef}>
      {label && <span className="block text-xs font-medium tracking-wide text-gray-600 mb-1 uppercase">{label}</span>}
      <input
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={()=>setOpen(true)}
        onChange={e=>{ onChange(e); if (!open) setOpen(true) }}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      />
      {!ready && !error && (
        <span className="absolute right-3 top-8 text-[10px] text-gray-400">Plain input</span>
      )}
      {error && <span className="absolute right-3 top-8 text-[10px] text-red-500">{error}</span>}
      {showDropdown && (
        <ul className="absolute z-20 mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
          {predictions.map(p => (
            <li key={p.place_id}>
              <button type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100" onClick={()=>handleSelect(p)}>
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  )
}
