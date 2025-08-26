const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { authUser, authAdmin, authDriver } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

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

// Get ride details
router.get('/:id', authUser, bookingController.getBookingById);

// Get all rides for a user
router.get('/user/:userId', authUser, bookingController.getUserRides);

// Update ride status (admin or driver only)
router.put('/:id/status', authUser, authDriver, [
    body('status').isIn(['PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED']).withMessage('Invalid status'),
], bookingController.updateBookingStatus);

module.exports = router;
