import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FormInput from '../../components/ui/FormInput'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreesToTerms: false,
    wantsNewsletter: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (formData.firstName.trim().length < 2) newErrors.firstName = 'First name must be at least 2 characters long'
    if (formData.lastName.trim().length > 0 && formData.lastName.trim().length < 2) newErrors.lastName = 'Last name must be at least 2 characters long'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number'
    if (!formData.password) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!formData.agreesToTerms) newErrors.agreesToTerms = 'You must agree to the terms and conditions'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    try {
      await register({
        fullname: {
          firstname: formData.firstName,
          lastname: formData.lastName
        },
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      
      // Redirect to home page on successful registration
      navigate('/')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl">C</div>
            <span className="text-2xl font-semibold tracking-tight text-gray-900">Cresta</span>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-gray-900">Create your account</h1>
          <p className="mt-2 text-sm text-gray-500">Already have an account? <Link to="/login" className="underline underline-offset-4 hover:text-gray-900">Sign in</Link></p>
        </div>
        <div className="card p-8">
          <form className="space-y-10" onSubmit={handleSubmit}>
            {/* General Error Message */}
            {errors.general && <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-xs font-medium text-red-600">{errors.general}</div>}

            {/* Personal Information */}
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="First Name *" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Jane" error={errors.firstName} />
                <FormInput label="Last Name *" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" error={errors.lastName} />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Email *" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" error={errors.email} />
                <FormInput label="Phone *" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="1234567890" error={errors.phone} />
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-xs font-semibold tracking-wide uppercase text-gray-500 mb-4">Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput label="Password *" name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Create a password" error={errors.password} />
                <FormInput label="Confirm Password *" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm password" error={errors.confirmPassword} />
              </div>
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <label className="flex items-start gap-3 text-xs text-gray-600">
                <input id="agreesToTerms" name="agreesToTerms" type="checkbox" checked={formData.agreesToTerms} onChange={handleInputChange} className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 ${errors.agreesToTerms ? 'border-red-400' : ''}`} />
                <span>I agree to the <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a> *</span>
              </label>
              {errors.agreesToTerms && <p className="text-xs text-red-600">{errors.agreesToTerms}</p>}
              <label className="flex items-start gap-3 text-xs text-gray-600">
                <input id="wantsNewsletter" name="wantsNewsletter" type="checkbox" checked={formData.wantsNewsletter} onChange={handleInputChange} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                <span>Send me occasional product updates and offers</span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button type="submit" disabled={isLoading} className="btn w-full disabled:opacity-50">
                {isLoading ? 'Creating Account…' : 'Create Account'}
              </button>
            </div>
          </form>
          <div className="mt-10 pt-6 border-t border-gray-200">
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-500">
              <li className="flex items-center justify-center gap-2">✓ Instant Bookings</li>
              <li className="flex items-center justify-center gap-2">✓ 24/7 Support</li>
              <li className="flex items-center justify-center gap-2">✓ Best Rates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage