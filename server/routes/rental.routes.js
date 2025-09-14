import express from 'express';
import * as bookingController from '../controllers/booking.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
const router = express.Router();

// Create a new rental booking
router.post('/', authUser, [
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must be [lng, lat]'),
    body('cars').isArray({ min: 1 }).withMessage('At least one car is required'),
    body('cars.*.carId').isMongoId().withMessage('Valid car ID is required'),
], bookingController.createRental);

// Get all rentals for a user
router.get('/user/:userId', authUser, bookingController.getUserRentals);

// Get rental details
router.get('/:id', authUser, bookingController.getBookingById);

// Update rental status (admin only)
router.put('/:id/status', authUser, authAdmin, [
    body('status').isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
], bookingController.updateBookingStatus);

// Cancel rental (user)
router.post('/:id/cancel', authUser, bookingController.cancelBooking);

export default router;
