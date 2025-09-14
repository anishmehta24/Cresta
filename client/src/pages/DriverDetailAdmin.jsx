import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import driverService from '../services/driverService'
import { toast } from '../services/toastBus'

export default function DriverDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ licenseNumber:'', status:'', currentCarId:'' })

  const load = async () => {
    setLoading(true)
    try { const data = await driverService.get(id); setDriver(data); setForm({
      licenseNumber: data.licenseNumber || '',
      status: data.status || '',
      currentCarId: data.currentCarId || ''
    }) } catch(e){ toast.error(e.message||'Failed to load driver') } finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  const handleChange = (e) => { const { name, value } = e.target; setForm(f=>({...f,[name]:value})) }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await driverService.update(id, form); toast.success('Driver updated'); load() } catch(e){ toast.error(e.message||'Update failed') } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this driver?')) return
    try { await driverService.remove(id); toast.success('Driver deleted'); navigate('/admin/drivers') } catch(e){ toast.error(e.message||'Delete failed') }
  }

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading…</div>
  if (!driver) return <div className="p-10 text-sm text-gray-400">Driver not found</div>

  const full = driver.userId?.fullname
  const name = typeof full === 'string' ? full : [full?.firstname, full?.lastname].filter(Boolean).join(' ') || 'Driver'
  const email = driver.userId?.email
  const phone = driver.userId?.phone
  const currentCar = driver.currentCarId
  const created = driver.createdAt ? new Date(driver.createdAt).toLocaleDateString('en-IN',{ month:'short', day:'numeric', year:'numeric' }) : ''

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row items-start gap-6">
        <div className="w-56 h-40 shrink-0 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-gray-400 text-xs uppercase tracking-wide">Driver Image</div>
        <div className="flex-1 w-full">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
            <h1 className="text-2xl font-semibold text-white">{name}</h1>
            <div className="flex gap-2">
              <Link to="/admin/drivers" className="btn btn-muted text-xs">Back</Link>
              <button onClick={handleDelete} className="btn btn-secondary text-xs">Delete</button>
            </div>
          </div>
          <div className="text-xs text-gray-400 space-y-1 mb-4">
            <div>License: {driver.licenseNumber} • Status: {driver.status}</div>
            {currentCar && <div>Current Car: {currentCar.model} <span className="text-gray-500">#{currentCar.licensePlate}</span></div>}
            {(email || phone) && <div>Contact: {email} {phone && <>• {phone}</>}</div>}
            {created && <div>Joined: {created}</div>}
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {['licenseNumber','status','currentCarId'].map(f => (
          <label key={f} className="block">
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
            <input name={f} value={form[f]} onChange={handleChange} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" />
          </label>
        ))}
        <div className="md:col-span-3 flex justify-end">
          <button disabled={saving} className="btn btn-primary px-6 disabled:opacity-50">{saving? 'Saving…':'Save Changes'}</button>
        </div>
      </form>
    </div>
  )
}
