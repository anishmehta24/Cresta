import { useState } from 'react'
import { Link } from 'react-router-dom'

const RentalCart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Toyota Camry',
      category: 'sedan',
      pricePerDay: 45,
      quantity: 1,
      startDate: '2025-09-01',
      endDate: '2025-09-05',
      image: '/api/placeholder/100/80',
      features: ['AC', 'Bluetooth', 'GPS', 'USB Charging']
    },
    {
      id: 3,
      name: 'BMW X5',
      category: 'suv',
      pricePerDay: 85,
      quantity: 1,
      startDate: '2025-09-02',
      endDate: '2025-09-04',
      image: '/api/placeholder/100/80',
      features: ['AC', 'Bluetooth', 'GPS', 'Leather Seats', 'Sunroof']
    }
  ])

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    address: ''
  })

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const updateDates = (id, startDate, endDate) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, startDate, endDate } : item
      )
    )
  }

  const getDaysBetween = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const getItemTotal = (item) => {
    const days = getDaysBetween(item.startDate, item.endDate)
    return item.pricePerDay * days * item.quantity
  }

  const subtotal = cartItems.reduce((sum, item) => sum + getItemTotal(item), 0)
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    
    // Validate customer info
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'licenseNumber']
    const missingFields = requiredFields.filter(field => !customerInfo[field])
    
    if (missingFields.length > 0) {
      alert(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    // Validate dates
    const invalidDates = cartItems.filter(item => !item.startDate || !item.endDate)
    if (invalidDates.length > 0) {
      alert('Please set rental dates for all vehicles')
      return
    }

    console.log('Checkout:', { cartItems, customerInfo, total })
    alert('Rental booking confirmed! You will receive a confirmation email shortly.')
    setCartItems([])
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h2m0 0h10m-10 0L5.4 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your rental cart is empty</h2>
            <p className="text-gray-600 mb-8">Browse our vehicle collection and add cars to your rental cart</p>
            <Link
              to="/rent-car"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Cart</h1>
          <p className="text-gray-600">Review your selected vehicles and complete your booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Car Image */}
                  <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                      </svg>
                      <span className="text-xs">{item.name}</span>
                    </div>
                  </div>

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.name}</h3>
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm capitalize mb-3">
                          {item.category}
                        </span>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.features.slice(0, 3).map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Rental Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={item.startDate}
                              onChange={(e) => updateDates(item.id, e.target.value, item.endDate)}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={item.endDate}
                              onChange={(e) => updateDates(item.id, item.startDate, e.target.value)}
                              min={item.startDate || new Date().toISOString().split('T')[0]}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex flex-col items-end space-y-4">
                        <div className="flex items-center space-x-3">
                          <label className="text-sm font-medium text-gray-700">Quantity:</label>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            ${item.pricePerDay}/day × {getDaysBetween(item.startDate, item.endDate)} days × {item.quantity}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            ${getItemTotal(item)}
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={customerInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={customerInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Driver's License Number *
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={customerInfo.licenseNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">${getItemTotal(item)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
              >
                Confirm Booking
              </button>

              <Link
                to="/rent-car"
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 block text-center"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Rental Terms</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Valid driver's license required</li>
                  <li>• Minimum age: 21 years</li>
                  <li>• Full fuel tank required at return</li>
                  <li>• Late return fees may apply</li>
                  <li>• Cancellation up to 24h before</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RentalCart