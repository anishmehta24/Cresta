import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg className="w-32 h-32 text-blue-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.529-.607-6.44-1.677A7.962 7.962 0 016 9.29C6 5.696 8.954 3 12.5 3s6.5 2.696 6.5 6.29a7.962 7.962 0 01-.56 2.97z" />
          </svg>
          
          <div className="text-6xl font-bold text-white mb-4">404</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 block"
          >
            Go Back Home
          </Link>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/book-ride"
              className="flex-1 border border-blue-400 text-blue-400 py-2 px-4 rounded-lg font-medium hover:bg-blue-900 hover:bg-opacity-20 transition-colors duration-200 text-center"
            >
              Book a Ride
            </Link>
            <Link
              to="/rent-car"
              className="flex-1 border border-green-400 text-green-400 py-2 px-4 rounded-lg font-medium hover:bg-green-900 hover:bg-opacity-20 transition-colors duration-200 text-center"
            >
              Rent a Car
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a
              href="#"
              className="flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Support
            </a>
            <a
              href="#"
              className="flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              FAQ
            </a>
            <a
              href="#"
              className="flex items-center justify-center text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Report Issue
            </a>
          </div>
        </div>

        {/* Popular Links */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <h4 className="text-md font-medium text-white mb-4">Popular Pages</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link to="/my-rides" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              My Rides
            </Link>
            <Link to="/my-rentals" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              My Rentals
            </Link>
            <Link to="/login" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              Sign In
            </Link>
            <Link to="/register" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage