import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authUser, authAdmin, authDriver } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
const router = express.Router();

// Create a new ride booking
router.post('/', authUser, [
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must be [lng, lat]'),
    body('dropoffLocation.address').notEmpty().withMessage('Dropoff address is required'),
    body('dropoffLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Dropoff coordinates must be [lng, lat]'),
    body('cars').isArray({ min: 1 }).withMessage('At least one car is required'),
    body('cars.*.carId').isMongoId().withMessage('Valid car ID is required'),
], bookingController.createRide);

// Get all rides for a user
router.get('/user/:userId', authUser, bookingController.getUserRides);

// Get ride details
router.get('/:id', authUser, bookingController.getBookingById);

// Update ride status (admin or driver only)
router.put('/:id/status', authUser, authDriver, [
    body('status').isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
], bookingController.updateBookingStatus);

export default router;
