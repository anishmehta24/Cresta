import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bookingService from '../services/bookingService'
import ErrorMessage from '../components/common/ErrorMessage'
import StatCard from '../components/ui/StatCard'
import { Skeleton, SkeletonText } from '../components/ui/Skeleton'
import FormInput from '../components/ui/FormInput'

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    firstName: user?.fullname?.firstname || '',
    lastName: user?.fullname?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) return
      setLoading(true); setError(null)
      try {
        const data = await bookingService.getUserProfile(user._id || user.id)
        if (mounted) setMetrics(data)
      } catch (e) {
        if (mounted) setError(e.message || 'Failed to load profile metrics')
      } finally { if (mounted) setLoading(false) }
    }
    load()
    return () => { mounted = false }
  }, [user])

  const handleLogout = () => logout()

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    // Placeholder for save endpoint (not yet implemented)
    setTimeout(() => { setSaving(false); setIsEditing(false) }, 600)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400">Please log in to view your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-token p-8 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 mb-6 sm:mb-0">
            <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-2xl tracking-tight">
              {user.fullname?.firstname?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{user.fullname?.firstname} {user.fullname?.lastname}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleLogout} className="btn btn-secondary text-sm">Sign Out</button>
            <button onClick={()=>setIsEditing(e=>!e)} className="btn btn-primary text-sm">{isEditing ? 'Cancel' : 'Edit Profile'}</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">Personal Information</h2>
                {isEditing && <span className="text-xs uppercase tracking-wide text-gray-500">Editing</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="First Name" value={form.firstName} disabled={!isEditing} onChange={v=>handleChange('firstName', v)} />
                <FormInput label="Last Name" value={form.lastName} disabled={!isEditing} onChange={v=>handleChange('lastName', v)} />
                <FormInput label="Email" value={form.email} type="email" disabled={!isEditing} onChange={v=>handleChange('email', v)} />
                <FormInput label="Phone" value={form.phone} type="tel" disabled={!isEditing} onChange={v=>handleChange('phone', v)} />
              </div>
              {isEditing && (
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={()=>{setIsEditing(false);}} className="btn btn-secondary">Cancel</button>
                  <button disabled={saving} onClick={handleSave} className="btn btn-primary disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {loading ? (
                Array.from({length:4}).map((_,i)=>(<Skeleton key={i} className="h-24 rounded-xl" />))
              ) : (
                <>
                  <StatCard title="Rides" value={metrics?.totalRides ?? 0} accent="blue" />
                  <StatCard title="Rentals" value={metrics?.totalRentals ?? 0} accent="purple" />
                  <StatCard title="Member Since" value={new Date(user.createdAt || Date.now()).getFullYear()} accent="gray" />
                  <StatCard title="Status" value={user.status || 'Active'} accent="green" />
                </>
              )}
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium tracking-wide uppercase text-gray-500 mb-4">Account Summary</h3>
              <ErrorMessage message={error} />
              {loading && <SkeletonText lines={3} />}
              {!loading && !error && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Total Rides</span><span className="font-medium text-gray-900">{metrics?.totalRides ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Total Rentals</span><span className="font-medium text-gray-900">{metrics?.totalRentals ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span className="font-medium text-gray-900">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span></div>
                </div>
              )}
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium tracking-wide uppercase text-gray-500 mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <Link to="/my-rides" className="action-chip">Ride History</Link>
                <Link to="/my-rentals" className="action-chip">Rental History</Link>
                <Link to="/payments" className="action-chip">Payments</Link>
                <Link to="/book-ride" className="action-chip">Book New Ride</Link>
                <Link to="/rent-car" className="action-chip">Start a Rental</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
