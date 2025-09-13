import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

// Import all routes (explicit .js extensions for ESM)
import userRoutes from './routes/user.routes.js';
import carRoutes from './routes/car.routes.js';
import driverRoutes from './routes/driver.routes.js';
import rideRoutes from './routes/ride.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';

import connectDB from './db/db.js';

const app = express();

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

export default app;

