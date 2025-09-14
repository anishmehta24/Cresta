export default function FormInput({ label, hint, error, className='', ...props }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-xs font-medium tracking-wide text-gray-600 mb-1 uppercase">{label}</span>}
      <input
        {...props}
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed`}
      />
      {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  )
}
