import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import driverService from '../services/driverService'
import { toast } from '../services/toastBus'

export default function DriverCreateAdmin(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ userId:'', licenseNumber:'' })
  const [saving, setSaving] = useState(false)

  const handleChange = (e)=>{ const {name,value} = e.target; setForm(f=>({...f,[name]:value})) }

  const handleSubmit = async (e)=>{
    e.preventDefault(); setSaving(true)
    try {
      const payload = { userId: form.userId.trim(), licenseNumber: form.licenseNumber.trim() }
      if(!payload.userId || !payload.licenseNumber) throw new Error('All fields required')
      await driverService.create(payload)
      toast.success('Driver created')
      navigate('/admin/drivers')
    } catch(err){ toast.error(err.message||'Failed to create driver') } finally { setSaving(false) }
  }

  const disabled = !form.userId || !form.licenseNumber

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Add Driver</h1>
        <Link to="/admin/drivers" className="text-xs text-blue-400 hover:text-blue-300">Back to Drivers</Link>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5 text-sm">
        {['userId','licenseNumber'].map(f => (
          <label key={f} className="block">
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
            <input name={f} value={form[f]} onChange={handleChange} placeholder={f} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" />
          </label>
        ))}
        <button disabled={saving||disabled} className="btn btn-primary w-full disabled:opacity-50">{saving? 'Creating…':'Create Driver'}</button>
      </form>
    </div>
  )
}
