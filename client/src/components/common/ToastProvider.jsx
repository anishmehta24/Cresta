import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { subscribeToToasts } from '../../services/toastBus'

const ToastContext = createContext({ addToast: () => {} })

let idCounter = 0

export const ToastProvider = ({ children, defaultDuration = 4000 }) => {
  const [toasts, setToasts] = useState([])
  const timeoutsRef = useRef({})

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
    if (timeoutsRef.current[id]) {
      clearTimeout(timeoutsRef.current[id])
      delete timeoutsRef.current[id]
    }
  }, [])

  const addToast = useCallback((toast) => {
    const id = ++idCounter
    const full = { id, duration: defaultDuration, ...toast }
    setToasts(prev => [...prev, full])
    timeoutsRef.current[id] = setTimeout(() => removeToast(id), full.duration)
  }, [defaultDuration, removeToast])

  useEffect(() => {
    const unsubscribe = subscribeToToasts(addToast)
    return unsubscribe
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type || 'info'}`} onClick={() => removeToast(t.id)}>
            <div className="toast-bar" />
            <div className="toast-content">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
