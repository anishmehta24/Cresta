import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import RideBooking from './pages/RideBooking'
import CarRental from './pages/CarRental'
import RentalCart from './pages/RentalCart'
import RideHistory from './pages/RideHistory'
import RentalHistory from './pages/RentalHistory'
import PaymentsPage from './pages/PaymentsPage'
import AdminDashboard from './pages/AdminDashboard'
import CarAdmin from './pages/CarAdmin'
import CarCreateAdmin from './pages/CarCreateAdmin'
import DriverAdmin from './pages/DriverAdmin'
import DriverCreateAdmin from './pages/DriverCreateAdmin'
import CarDetailAdmin from './pages/CarDetailAdmin'
import DriverDetailAdmin from './pages/DriverDetailAdmin'
import RequireAuth from './components/routing/RequireAuth'
import RequireAdmin from './components/routing/RequireAdmin'
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
            <Route path="/book-ride" element={<RequireAuth><RideBooking /></RequireAuth>} />
            <Route path="/rent-car" element={<RequireAuth><CarRental /></RequireAuth>} />
            <Route path="/rental-cart" element={<RequireAuth><RentalCart /></RequireAuth>} />
            <Route path="/my-rides" element={<RequireAuth><RideHistory /></RequireAuth>} />
            <Route path="/my-rentals" element={<RequireAuth><RentalHistory /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="/payments" element={<RequireAuth><PaymentsPage /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/cars" element={<RequireAdmin><CarAdmin /></RequireAdmin>} />
            <Route path="/admin/cars/new" element={<RequireAdmin><CarCreateAdmin /></RequireAdmin>} />
            <Route path="/admin/cars/:id" element={<RequireAdmin><CarDetailAdmin /></RequireAdmin>} />
            <Route path="/admin/drivers" element={<RequireAdmin><DriverAdmin /></RequireAdmin>} />
            <Route path="/admin/drivers/new" element={<RequireAdmin><DriverCreateAdmin /></RequireAdmin>} />
            <Route path="/admin/drivers/:id" element={<RequireAdmin><DriverDetailAdmin /></RequireAdmin>} />
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
