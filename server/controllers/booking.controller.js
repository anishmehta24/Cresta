import * as bookingService from '../services/booking.service.js';
import { validationResult } from 'express-validator';

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

export const getBookingById = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await bookingService.getBookingById(bookingId);
        
        // Users can only access their own bookings unless they're admin or driver
        if (req.user.role !== 'admin' && 
            req.user.role !== 'driver' && 
            booking.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json({ booking });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const bookingType = req.query.type; // 'RIDE' or 'RENTAL'
        
        // Users can only access their own bookings unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const bookings = await bookingService.getUserBookings(userId, bookingType);
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

// Separate controllers for rides and rentals for cleaner routes
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

export const getUserRides = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Users can only access their own rides unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const rides = await bookingService.getUserBookings(userId, 'RIDE');
        res.status(200).json({ rides });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserRentals = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Users can only access their own rentals unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const rentals = await bookingService.getUserBookings(userId, 'RENTAL');
        res.status(200).json({ rentals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
