export default function StatusBadge({ status }) {
  if (!status) return null
  const s = status.toLowerCase()
  const map = {
    completed: 'bg-green-100 text-green-700 ring-green-200',
    confirmed: 'bg-blue-100 text-blue-700 ring-blue-200',
    ongoing: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
    pending: 'bg-gray-100 text-gray-700 ring-gray-200',
    cancelled: 'bg-red-100 text-red-700 ring-red-200',
    upcoming: 'bg-blue-100 text-blue-700 ring-blue-200',
    active: 'bg-yellow-100 text-yellow-700 ring-yellow-200'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset capitalize ${map[s] || 'bg-gray-100 text-gray-700 ring-gray-200'}`}>{s}</span>
  )
}
