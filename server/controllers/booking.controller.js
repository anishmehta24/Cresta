import * as bookingService from '../services/booking.service.js';
import { validationResult } from 'express-validator';
import bookingModel from '../models/booking.model.js';

// Create booking (general)
export const createBooking = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bookingData = {
            ...req.body,
            userId: req.user._id
        };

        const booking = await bookingService.createBooking(bookingData);
        res.status(201).json({ booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.getBookingById(bookingId);
        
        if (
            req.user.role !== 'admin' && 
            req.user.role !== 'driver' && 
            booking.userId._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// Get all bookings for a user
export const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const bookingType = req.query.type; // 'RIDE' or 'RENTAL'
        
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const bookings = await bookingService.getUserBookings(userId, bookingType);
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const bookingId = req.params.id;
        const { status } = req.body;

        const booking = await bookingService.updateBookingStatus(bookingId, status);
        res.status(200).json({ booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create Ride
export const createRide = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rideData = {
            ...req.body,
            userId: req.user._id,
            bookingType: 'RIDE'
        };

        const ride = await bookingService.createBooking(rideData);
        res.status(201).json({ ride });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create Rental
export const createRental = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const rentalData = {
            ...req.body,
            userId: req.user._id,
            bookingType: 'RENTAL'
        };

        const rental = await bookingService.createBooking(rentalData);
        res.status(201).json({ rental });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get user rides
export const getUserRides = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const rides = await bookingService.getUserBookings(userId, 'RIDE');
        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user rentals
export const getUserRentals = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const rentals = await bookingService.getUserBookings(userId, 'RENTAL');
        res.status(200).json({ rentals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Complete Ride (new route)
export const completeRide = async (req, res, next) => {
    try {
        const bookingId = req.params.id;

        const booking = await bookingService.updateBookingStatus(bookingId, 'COMPLETED');
        
        res.status(200).json({ message: 'Ride completed successfully', booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Cancel booking (user-owned)
export const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await bookingModel.findById(bookingId);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        if (!['PENDING','CONFIRMED','ONGOING'].includes(booking.status)) {
            return res.status(400).json({ error: 'Cannot cancel this booking' });
        }
        const updated = await bookingService.updateBookingStatus(bookingId, 'CANCELLED');
        res.status(200).json({ message: 'Booking cancelled', booking: updated });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
