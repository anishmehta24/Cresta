const paymentService = require('../services/payment.service');
const { validationResult } = require('express-validator');

module.exports.createPayment = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const payment = await paymentService.createPayment(req.body);
        res.status(201).json({ payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getPaymentById = async (req, res, next) => {
    try {
        const paymentId = req.params.id;
        const payment = await paymentService.getPaymentById(paymentId);
        
        // Users can only access their own payments unless they're admin
        if (req.user.role !== 'admin' && 
            payment.bookingId.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.status(200).json({ payment });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.getUserPayments = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        
        // Users can only access their own payments unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const payments = await paymentService.getUserPayments(userId);
        res.status(200).json({ payments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.updatePaymentStatus = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const paymentId = req.params.id;
        const { status } = req.body;

        const payment = await paymentService.updatePaymentStatus(paymentId, status);
        res.status(200).json({ payment });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
