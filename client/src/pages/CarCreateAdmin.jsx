import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import carService from '../services/carService'
import { toast } from '../services/toastBus'

export default function CarCreateAdmin(){
  const navigate = useNavigate()
  const [form, setForm] = useState({ model:'', licensePlate:'', capacity:'', pricePerKm:'', pricePerDay:'' })
  const [saving, setSaving] = useState(false)

  const handleChange = (e)=>{ const {name,value} = e.target; setForm(f=>({...f,[name]:value})) }

  const handleSubmit = async (e)=>{
    e.preventDefault(); setSaving(true)
    try {
      const payload = {
        model: form.model.trim(),
        licensePlate: form.licensePlate.trim(),
        capacity: Number(form.capacity)||1,
        pricePerKm: Number(form.pricePerKm)||0,
        pricePerDay: Number(form.pricePerDay)||0
      }
      await carService.create(payload)
      toast.success('Car created')
      navigate('/admin/cars')
    } catch(err){ toast.error(err.message||'Failed to create car') } finally { setSaving(false) }
  }

  const disabled = !form.model || !form.licensePlate || !form.capacity

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Add New Car</h1>
        <Link to="/admin/cars" className="text-xs text-blue-400 hover:text-blue-300">Back to Cars</Link>
      </div>
      <form onSubmit={handleSubmit} className="card p-6 space-y-5 text-sm">
        {['model','licensePlate','capacity','pricePerKm','pricePerDay'].map(f => (
          <label key={f} className="block">
            <span className="block text-[10px] uppercase tracking-wide text-gray-400 mb-1">{f}</span>
            <input name={f} value={form[f]} onChange={handleChange} placeholder={f} className="w-full rounded-md bg-white/90 border border-gray-300 px-3 py-2 text-gray-900" />
          </label>
        ))}
        <button disabled={saving||disabled} className="btn btn-primary w-full disabled:opacity-50">{saving? 'Creating…':'Create Car'}</button>
      </form>
    </div>
  )
}
