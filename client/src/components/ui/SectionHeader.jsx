export default function SectionHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1 max-w-prose">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
