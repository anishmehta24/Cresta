export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-white">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-6">
        {icon || (
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M4.93 4.93l14.14 14.14"/></svg>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {message && <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{message}</p>}
      {action}
    </div>
  )
}
