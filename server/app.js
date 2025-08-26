const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

// Import all routes
const userRoutes = require('./routes/user.routes');
const carRoutes = require('./routes/car.routes');
const driverRoutes = require('./routes/driver.routes');
const rideRoutes = require('./routes/ride.routes');
const rentalRoutes = require('./routes/rental.routes');
const paymentRoutes = require('./routes/payment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();
const connectDB = require('./db/db');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
    res.send('Hello, World!');
});

// Mount all routes
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;

