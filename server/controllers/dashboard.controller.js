import * as dashboardService from '../services/dashboard.service.js';
import bookingModel from '../models/booking.model.js';
import paymentModel from '../models/payment.model.js';

export const getDashboardOverview = async (req, res, next) => {
    try {
        const overview = await dashboardService.getDashboardOverview();
        res.status(200).json({ overview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id.toString();
        const [rides, rentals, activeUpcoming, recentRides, recentRentals, totalSpentAgg] = await Promise.all([
            bookingModel.countDocuments({ userId, bookingType: 'RIDE' }),
            bookingModel.countDocuments({ userId, bookingType: 'RENTAL' }),
            bookingModel.countDocuments({ userId, status: { $in: ['CONFIRMED','ONGOING','PENDING'] } }),
            bookingModel.find({ userId, bookingType: 'RIDE' }).sort({ createdAt: -1 }).limit(5),
            bookingModel.find({ userId, bookingType: 'RENTAL' }).sort({ createdAt: -1 }).limit(5),
            paymentModel.aggregate([
                { $match: { userId, status: 'PAID' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
        ]);
        res.status(200).json({
            totalRides: rides,
            totalRentals: rentals,
            activeUpcoming,
            totalSpent: totalSpentAgg[0]?.total || 0,
            recentRides,
            recentRentals
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
