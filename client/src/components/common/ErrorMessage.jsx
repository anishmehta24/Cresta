export default function ErrorMessage({ message, retry, className = '' }) {
	if (!message) return null
	return (
		<div
			role="alert"
			className={`rounded-md border border-red-300 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-start gap-2 ${className}`.trim()}
		>
			<svg
				className="w-4 h-4 mt-[2px] flex-shrink-0"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
			</svg>
			<div className="flex-1">
				<div>{message}</div>
				{retry && (
					<button
						type="button"
						onClick={retry}
						className="mt-1 inline-flex items-center text-xs font-medium text-red-700 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
					>
						Try again
					</button>
				)}
			</div>
		</div>
	)
}
