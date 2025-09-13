import express from 'express';
import * as driverController from '../controllers/driver.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
const router = express.Router();

// Create a new driver (admin only)
router.post('/', authUser, authAdmin, [
    body('userId').isMongoId().withMessage('Valid user ID is required'),
    body('licenseNumber').notEmpty().withMessage('License number is required'),
], driverController.createDriver);

// Get all drivers (with optional filters)
router.get('/', authUser, driverController.getAllDrivers);

// Get single driver details
router.get('/:id', authUser, driverController.getDriverById);

// Update driver info (admin only)
router.put('/:id', authUser, authAdmin, [
    body('licenseNumber').optional().notEmpty().withMessage('License number cannot be empty'),
    body('status').optional().isIn(['AVAILABLE', 'ON_RIDE', 'OFFLINE']).withMessage('Invalid status'),
    body('currentCarId').optional().isMongoId().withMessage('Valid car ID is required'),
], driverController.updateDriver);

// Soft delete driver (admin only)
router.delete('/:id', authUser, authAdmin, driverController.deleteDriver);

export default router;
