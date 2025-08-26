const userModel = require('../models/user.model');
const carModel = require('../models/car.model');
const driverModel = require('../models/driver.model');
const bookingModel = require('../models/booking.model');
const paymentModel = require('../models/payment.model');

module.exports.getDashboardOverview = async () => {
    const [
        totalUsers,
        totalCars,
        totalDrivers,
        totalBookings,
        totalPayments,
        activeRides,
        activeRentals,
        availableCars,
        availableDrivers
    ] = await Promise.all([
        userModel.countDocuments({ role: 'user' }),
        carModel.countDocuments(),
        driverModel.countDocuments(),
        bookingModel.countDocuments(),
        paymentModel.countDocuments(),
        bookingModel.countDocuments({ bookingType: 'RIDE', status: { $in: ['CONFIRMED', 'ONGOING'] } }),
        bookingModel.countDocuments({ bookingType: 'RENTAL', status: { $in: ['CONFIRMED', 'ONGOING'] } }),
        carModel.countDocuments({ status: 'AVAILABLE' }),
        driverModel.countDocuments({ status: 'AVAILABLE' })
    ]);

    // Get recent bookings
    const recentBookings = await bookingModel.find()
        .populate('userId', 'fullname')
        .populate('cars.carId', 'model licensePlate')
        .sort({ createdAt: -1 })
        .limit(10);

    // Get revenue stats (simplified)
    const totalRevenue = await paymentModel.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return {
        stats: {
            totalUsers,
            totalCars,
            totalDrivers,
            totalBookings,
            totalPayments,
            activeRides,
            activeRentals,
            availableCars,
            availableDrivers,
            totalRevenue: totalRevenue[0]?.total || 0
        },
        recentBookings
    };
};
