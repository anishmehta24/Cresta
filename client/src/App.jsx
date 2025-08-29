import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import RideBooking from './pages/RideBooking'
import CarRental from './pages/CarRental'
import RentalCart from './pages/RentalCart'
import RideHistory from './pages/RideHistory'
import RentalHistory from './pages/RentalHistory'
// import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'
import LoginPage from './pages/auth/LoginPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/book-ride" element={<RideBooking />} />
            <Route path="/rent-car" element={<CarRental />} />
            <Route path="/rental-cart" element={<RentalCart />} />
            <Route path="/my-rides" element={<RideHistory />} />
            <Route path="/my-rentals" element={<RentalHistory />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
