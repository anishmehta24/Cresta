export default function LoadingSpinner({ size = 32, className = '' }) {
	const dim = typeof size === 'number' ? `${size}px` : size
	return (
		<div
			role="status"
			aria-live="polite"
			className={`inline-flex items-center justify-center ${className}`.trim()}
			style={{ width: dim, height: dim }}
		>
			<svg
				className="animate-spin text-gray-400"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style={{ width: dim, height: dim }}
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-90"
					fill="currentColor"
					d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
				/>
			</svg>
			<span className="sr-only">Loading...</span>
		</div>
	)
}
