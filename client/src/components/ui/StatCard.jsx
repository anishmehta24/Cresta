export default function StatCard({ label, value, icon, accent = 'gray' }) {
  const accentMap = {
    blue: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100',
    green: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-100',
    purple: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-100',
    orange: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-100',
    gray: 'bg-gray-50 text-gray-700 ring-1 ring-inset ring-gray-100'
  }
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-medium tracking-wide uppercase text-gray-500">{label}</span>
        {icon && <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${accentMap[accent]}`}>{icon}</span>}
      </div>
      <div className="text-2xl font-semibold text-gray-900 leading-none">{value}</div>
    </div>
  )
}
