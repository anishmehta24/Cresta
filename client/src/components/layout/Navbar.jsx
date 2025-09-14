import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const profileMenuRef = useRef(null)

  // Close profile menu when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsProfileMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  const toggleProfileMenu = useCallback(() => setIsProfileMenuOpen(o => !o), [])

  const firstName = user?.fullname?.firstname || 'User'
  const initial = firstName.charAt(0).toUpperCase()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Book a Ride', path: '/book-ride' },
    { name: 'Rent a Car', path: '/rent-car' },
    ...(isAuthenticated ? [
      { name: 'My Rides', path: '/my-rides' },
      { name: 'My Rentals', path: '/my-rentals' }
    ] : []),
    ...(user?.role === 'admin' ? [
      { name: 'Admin', path: '/admin' }
    ] : [])
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-black/70 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[var(--mono-border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-white">Cresta</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>{item.name}</Link>
            ))}
          </div>

          {/* Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={toggleProfileMenu}
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                  className={`group flex items-center gap-2 rounded-full pl-1 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors border border-[var(--mono-border)] bg-[var(--mono-bg-2)] hover:bg-[var(--mono-bg-3)]`}
                >
                  <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-semibold text-sm shadow-inner">
                    {initial}
                    <span className="absolute inset-0 rounded-full ring-1 ring-white/10" />
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium text-gray-200">
                    <span className="max-w-[90px] truncate">{firstName}</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isProfileMenuOpen && (
                  <div
                    role="menu"
                    aria-label="User menu"
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[var(--mono-border)] bg-[var(--mono-bg-2)] shadow-xl shadow-black/50 backdrop-blur-sm focus:outline-none overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[var(--mono-border)]">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{firstName}</p>
                    </div>
                    <div className="py-1" role="none">
                      <Link
                        to="/profile"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[var(--mono-bg-3)] hover:text-white transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >Profile</Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          role="menuitem"
                          className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[var(--mono-bg-3)] hover:text-white transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >Admin Dashboard</Link>
                      )}
                      <Link
                        to="/my-rides"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[var(--mono-bg-3)] hover:text-white transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >Rides</Link>
                      <Link
                        to="/my-rentals"
                        role="menuitem"
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-[var(--mono-bg-3)] hover:text-white transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >Rentals</Link>
                    </div>
                    <div className="border-t border-[var(--mono-border)]">
                      <button
                        role="menuitem"
                        onClick={() => { logout(); setIsProfileMenuOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-link">Sign In</Link>
                <Link to="/register" className="btn btn-primary text-sm px-5 py-2">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md nav-link hover:bg-[var(--mono-bg-2)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--mono-border)] bg-[var(--mono-bg-2)]">
            <div className="flex flex-col space-y-3">
              {navItems.map(item => (
                <Link key={item.name} to={item.path} className={`nav-link ${isActive(item.path)?'active':''}`} onClick={() => setIsMenuOpen(false)}>{item.name}</Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-[var(--mono-border)]">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user?.fullname?.firstname?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-white">
                        {user?.fullname?.firstname || 'User'}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-700 rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="px-3 py-2 text-sm font-medium text-red-400 hover:bg-gray-700 rounded-md text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                    <Link to="/register" className="btn btn-primary text-sm" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar