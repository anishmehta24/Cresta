import { useEffect, useState } from 'react'
import bookingService from '../services/bookingService'
import authService from '../services/authService'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/ui/StatCard'
import { formatINR } from '../services/currency'
import SectionHeader from '../components/ui/SectionHeader'
import { Skeleton } from '../components/ui/Skeleton'

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
			<div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
				<SectionHeader title="Dashboard" description="Overview of your recent ride and rental activity." />
				<ErrorMessage message={error} />
				{loading && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
						{Array.from({length:4}).map((_,i)=>(<Skeleton key={i} className="h-28 rounded-xl" />))}
					</div>
				)}
				{stats && (
					<>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
							<StatCard label="Total Rides" value={stats.totalRides} accent="blue" />
							<StatCard label="Total Rentals" value={stats.totalRentals} accent="purple" />
							<StatCard label="Total Spent" value={formatINR(stats.totalSpent || 0)} accent="green" />
							<StatCard label="Active / Upcoming" value={stats.activeUpcoming || 0} accent="orange" />
						</div>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<RecentList title="Recent Rides" items={(stats.recentRides||[]).slice(0,5)} type="ride" />
							<RecentList title="Recent Rentals" items={(stats.recentRentals||[]).slice(0,5)} type="rental" />
						</div>
					</>
				)}
			</div>
		)
}

	function RecentList({ title, items, type }) {
		return (
			<div className="bg-white rounded-xl shadow-token p-6">
				<h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">{title}</h3>
				{items.length === 0 && <div className="text-xs text-gray-500 py-8 text-center">No {type} activity yet.</div>}
				<ul className="divide-y divide-gray-100">
					{items.map(it => (
						<li key={it._id} className="py-3 flex items-center justify-between">
							<div>
								{type === 'ride' ? (
									<>
										<div className="text-sm font-medium text-gray-900">{it.pickupLocation?.address || 'Pickup'} → {it.dropoffLocation?.address || 'Dropoff'}</div>
										<div className="text-xs text-gray-500">{new Date(it.startTime).toLocaleString()}</div>
									</>
								) : (
									<>
										<div className="text-sm font-medium text-gray-900">{it.cars?.length || 0} car(s) • {new Date(it.startTime).toLocaleDateString()} - {it.endTime ? new Date(it.endTime).toLocaleDateString() : '—'}</div>
										<div className="text-xs text-gray-500">Booked {new Date(it.createdAt).toLocaleDateString()}</div>
									</>
								)}
							</div>
								<div className="text-sm font-semibold text-gray-800">{formatINR(it.totalAmount || 0)}</div>
						</li>
					))}
				</ul>
			</div>
		)
	}
