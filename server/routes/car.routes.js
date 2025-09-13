import express from 'express';
import * as carController from '../controllers/car.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
const router = express.Router();

// Create a new car (admin only)
router.post('/', authUser, authAdmin, [
    body('model').notEmpty().withMessage('Car model is required'),
    body('licensePlate').notEmpty().withMessage('License plate is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('pricePerKm').optional().isFloat({ min: 0 }).withMessage('Price per km must be a positive number'),
    body('pricePerDay').optional().isFloat({ min: 0 }).withMessage('Price per day must be a positive number'),
], carController.createCar);

// Get all cars (with optional filters)
router.get('/', authUser, carController.getAllCars);

// Get single car details
router.get('/:id', authUser, carController.getCarById);

// Update car details (admin only)
router.put('/:id', authUser, authAdmin, [
    body('model').optional().notEmpty().withMessage('Car model cannot be empty'),
    body('licensePlate').optional().notEmpty().withMessage('License plate cannot be empty'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('pricePerKm').optional().isFloat({ min: 0 }).withMessage('Price per km must be a positive number'),
    body('pricePerDay').optional().isFloat({ min: 0 }).withMessage('Price per day must be a positive number'),
    body('status').optional().isIn(['AVAILABLE', 'ON_RIDE', 'RENTED', 'MAINTENANCE']).withMessage('Invalid status'),
], carController.updateCar);

// Soft delete a car (admin only)
router.delete('/:id', authUser, authAdmin, carController.deleteCar);

export default router;
