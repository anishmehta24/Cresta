// Simple pub/sub event bus for toasts
const listeners = new Set()

export const subscribeToToasts = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const publishToast = (toast) => {
  listeners.forEach(fn => fn(toast))
}

// Convenience helpers
export const toast = {
  info: (msg, opts={}) => publishToast({ type:'info', message:msg, ...opts }),
  success: (msg, opts={}) => publishToast({ type:'success', message:msg, ...opts }),
  error: (msg, opts={}) => publishToast({ type:'error', message:msg, ...opts }),
  warn: (msg, opts={}) => publishToast({ type:'warn', message:msg, ...opts })
}
