const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { authUser, authAdmin } = require('../middleware/auth.middleware');
const { body } = require('express-validator');

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

module.exports = router;
