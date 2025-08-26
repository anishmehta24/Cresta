const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authUser, authAdmin } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

// Create a new rental booking
router.post('/', authUser, [
    body('startTime').isISO8601().withMessage('Valid start time is required'),
    body('endTime').isISO8601().withMessage('Valid end time is required'),
    body('pickupLocation.address').notEmpty().withMessage('Pickup address is required'),
    body('pickupLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Pickup coordinates must be [lng, lat]'),
    body('cars').isArray({ min: 1 }).withMessage('At least one car is required'),
    body('cars.*.carId').isMongoId().withMessage('Valid car ID is required'),
], bookingController.createRental);

// Get rental details
router.get('/:id', authUser, bookingController.getBookingById);

// Get all rentals for a user
router.get('/user/:userId', authUser, bookingController.getUserRentals);

// Update rental status (admin only)
router.put('/:id/status', authUser, authAdmin, [
    body('status').isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
], bookingController.updateBookingStatus);

module.exports = router;
