import express from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';
const router = express.Router();

// Create a payment
router.post('/', authUser, [
    body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
    body('method').isIn(['CASH', 'CARD', 'WALLET', 'UPI']).withMessage('Invalid payment method'),
], paymentController.createPayment);

// Get payment details
router.get('/:id', authUser, paymentController.getPaymentById);

// Get all payments for a user
router.get('/user/:userId', authUser, paymentController.getUserPayments);

// Update payment status (admin only)
router.put('/:id/status', authUser, authAdmin, [
    body('status').isIn(['PENDING', 'PAID', 'FAILED']).withMessage('Invalid payment status'),
], paymentController.updatePaymentStatus);

export default router;
