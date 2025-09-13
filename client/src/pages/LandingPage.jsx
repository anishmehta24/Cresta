import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-semibold mb-8 leading-[1.1] tracking-tight">
                Move Smarter.
                <br />
                Ride. Rent. Repeat.
              </h1>
              <p className="text-xl text-muted max-w-xl mb-10 leading-relaxed">
                Instant rides and flexible car rentals in one unified platform. High availability, trusted drivers, seamless experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/book-ride" className="btn btn-primary text-base px-8 py-4">Book a Ride</Link>
                <Link to="/rent-car" className="btn btn-outline text-base px-8 py-4">Browse Cars</Link>
              </div>
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label:'Availability', value:'24/7' },
                  { label:'Vehicles', value:'500+' },
                  { label:'Customers', value:'1K+' },
                  { label:'Drivers', value:'100+' }
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                    <div className="text-faint text-xs tracking-wide uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="hero-image-placeholder">IMAGE / MAP AREA</div>
              <div className="grid grid-cols-3 gap-4">
                {['Fast Pickup','Transparent Pricing','Trusted Drivers'].map(tag => (
                  <div key={tag} className="card p-4 text-center text-sm font-medium tracking-wide">{tag}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
  <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4 tracking-tight">Our Services</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">Choose from our range of transportation solutions designed to meet your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Ride Booking Service */}
            <div className="card p-10 hover:border-mono-border-light transition-colors">
              <h3 className="text-2xl font-semibold mb-5">Ride Booking</h3>
              <p className="text-muted mb-6 leading-relaxed">Book instant rides with our professional drivers. Safe, reliable, and comfortable transportation whenever you need it.</p>
              <ul className="space-y-2 mb-8">
                {['Professional drivers','Real-time tracking','Flexible scheduling'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-muted">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/book-ride" className="btn btn-primary w-full">Book Now</Link>
            </div>

            {/* Car Rental Service */}
            <div className="card p-10 hover:border-mono-border-light transition-colors">
              <h3 className="text-2xl font-semibold mb-5">Car Rental</h3>
              <p className="text-muted mb-6 leading-relaxed">Rent from our diverse fleet of well-maintained vehicles. Perfect for short trips, long journeys, or multiple car rentals.</p>
              <ul className="space-y-2 mb-8">
                {['Wide vehicle selection','Flexible rental periods','Multiple car bookings'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-muted">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white"></span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/rent-car" className="btn btn-primary w-full">Browse Cars</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
  <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-semibold mb-4 tracking-tight">Why Choose Cresta?</h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">We provide exceptional transportation services with a focus on safety, reliability, and customer satisfaction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title:'Safe & Secure', desc:'All our drivers are professionally trained and vehicles are regularly maintained for your safety.' },
              { title:'Always On Time', desc:'Punctuality is our priority. We ensure you reach your destination on time, every time.' },
              { title:'Customer First', desc:'Your satisfaction is our success. We go the extra mile to provide exceptional service.' }
            ].map(item => (
              <div key={item.title} className="text-center card p-10">
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-[var(--mono-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-6 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl text-muted mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Cresta for their transportation needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-ride" className="btn btn-primary text-base px-10 py-4">Book Your First Ride</Link>
            <Link to="/register" className="btn btn-outline text-base px-10 py-4">Create Account</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage