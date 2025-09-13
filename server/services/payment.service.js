import paymentModel from '../models/payment.model.js';
import bookingModel from '../models/booking.model.js';

export const createPayment = async ({ bookingId, amount, method }) => {
    if (!bookingId || !amount || !method) {
        throw new Error('Booking ID, amount, and payment method are required');
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    // Check if payment already exists for this booking
    const existingPayment = await paymentModel.findOne({ bookingId });
    if (existingPayment) {
        throw new Error('Payment already exists for this booking');
    }

    const payment = await paymentModel.create({
        bookingId,
        amount,
        method,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });

    return await payment.populate('bookingId', 'userId bookingType totalAmount');
};

export const getPaymentById = async (paymentId) => {
    const payment = await paymentModel.findById(paymentId)
        .populate({
            path: 'bookingId',
            select: 'userId bookingType totalAmount startTime',
            populate: { path: 'userId', select: 'fullname email' }
        });
    
    if (!payment) {
        throw new Error('Payment not found');
    }
    
    return payment;
};

export const getUserPayments = async (userId) => {
    const payments = await paymentModel.find()
        .populate({
            path: 'bookingId',
            match: { userId: userId },
            select: 'bookingType totalAmount startTime'
        })
        .sort({ createdAt: -1 });
    
    // Filter out payments where booking doesn't match the user
    return payments.filter(payment => payment.bookingId);
};

export const updatePaymentStatus = async (paymentId, status) => {
    const payment = await paymentModel.findById(paymentId);
    if (!payment) {
        throw new Error('Payment not found');
    }

    payment.status = status;
    if (status === 'PAID') {
        payment.paidAt = new Date();
    }

    await payment.save();
    
    return await payment.populate('bookingId', 'userId bookingType totalAmount');
};
