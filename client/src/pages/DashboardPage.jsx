import { useEffect, useState } from 'react'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ErrorMessage from '../components/common/ErrorMessage'

export default function DashboardPage() {
	const [stats, setStats] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		let mounted = true
		const load = async () => {
			setLoading(true); setError(null)
			try {
				const user = authService.getCurrentUser()
				if (!user) { setError('Not authenticated'); return }
				const data = await bookingService.getDashboardStats(user._id || user.id)
				if (mounted) setStats(data)
			} catch (e) {
				if (mounted) setError(e.message || 'Failed to load dashboard stats')
			} finally { if (mounted) setLoading(false) }
		}
		load()
		return () => { mounted = false }
	}, [])

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-10">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
					<p className="text-gray-600">Overview of your activity</p>
				</div>

				{loading && <LoadingSpinner className="my-6" />}
				<ErrorMessage message={error} />

				{stats && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							<StatCard label="Total Rides" value={stats.totalRides} accent="blue" />
							<StatCard label="Total Rentals" value={stats.totalRentals} accent="purple" />
							<StatCard label="Total Spent" value={`$${(stats.totalSpent || 0).toFixed(2)}`} accent="green" />
							<StatCard label="Active / Upcoming" value={stats.activeUpcoming || 0} accent="orange" />
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="bg-white rounded-xl shadow p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rides</h2>
								<ul className="divide-y divide-gray-100">
									{(stats.recentRides || []).slice(0,5).map(r => (
										<li key={r._id} className="py-3 flex items-center justify-between">
											<div>
												<div className="text-sm font-medium text-gray-900">{r.pickupLocation?.address || 'Pickup'} → {r.dropoffLocation?.address || 'Dropoff'}</div>
												<div className="text-xs text-gray-500">{new Date(r.startTime).toLocaleString()}</div>
											</div>
											<div className="text-sm font-semibold text-gray-800">${(r.totalAmount || 0).toFixed(2)}</div>
										</li>
									))}
									{(stats.recentRides || []).length === 0 && <li className="py-6 text-sm text-gray-500 text-center">No rides yet</li>}
								</ul>
							</div>

							<div className="bg-white rounded-xl shadow p-6">
								<h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Rentals</h2>
								<ul className="divide-y divide-gray-100">
									{(stats.recentRentals || []).slice(0,5).map(r => (
										<li key={r._id} className="py-3 flex items-center justify-between">
											<div>
												<div className="text-sm font-medium text-gray-900">{r.cars?.length || 0} car(s) • {new Date(r.startTime).toLocaleDateString()} - {r.endTime ? new Date(r.endTime).toLocaleDateString() : '—'}</div>
												<div className="text-xs text-gray-500">Booked {new Date(r.createdAt).toLocaleDateString()}</div>
											</div>
											<div className="text-sm font-semibold text-gray-800">${(r.totalAmount || 0).toFixed(2)}</div>
										</li>
									))}
									{(stats.recentRentals || []).length === 0 && <li className="py-6 text-sm text-gray-500 text-center">No rentals yet</li>}
								</ul>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

function StatCard({ label, value, accent = 'blue' }) {
	const colorMap = {
		blue: 'text-blue-600 bg-blue-50',
		green: 'text-green-600 bg-green-50',
		purple: 'text-purple-600 bg-purple-50',
		orange: 'text-orange-600 bg-orange-50'
	}
	return (
		<div className="bg-white rounded-xl shadow p-6 flex flex-col">
			<span className="text-sm text-gray-500 mb-2">{label}</span>
			<span className={`text-2xl font-bold ${colorMap[accent] || ''} inline-block px-2 py-1 rounded`}>{value}</span>
		</div>
	)
}
