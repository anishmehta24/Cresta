import { useState } from 'react'
export default function Tabs({ tabs, initial, onChange, className='' }) {
  const [active, setActive] = useState(initial || tabs[0]?.key)
  const change = (k) => { setActive(k); onChange && onChange(k) }
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map(t => {
        const isActive = active === t.key
        return (
          <button
            key={t.key}
            onClick={() => change(t.key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition focus:outline-none focus:ring-2 focus:ring-gray-900/40 border ${isActive ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'} `}
          >
            {t.label}{typeof t.count==='number' && <span className="ml-1 text-[10px] opacity-70">{t.count}</span>}
          </button>
        )
      })}
    </div>
  )
}
