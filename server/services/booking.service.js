import bookingModel from '../models/booking.model.js';
import carModel from '../models/car.model.js';
import driverModel from '../models/driver.model.js';

export const createBooking = async (bookingData) => {
    const { userId, bookingType, startTime, pickupLocation, dropoffLocation, cars } = bookingData;

    if (!userId || !bookingType || !startTime || !cars || cars.length === 0) {
        throw new Error('Required fields are missing');
    }

    const validatedCars = [];

    for (const carRequest of cars) {
        const car = await carModel.findById(carRequest.carId);
        if (!car) {
            throw new Error(`Car with ID ${carRequest.carId} not found`);
        }

        if (car.status !== 'AVAILABLE') {
            throw new Error(`Car ${car.model} (${car.licensePlate}) is not available`);
        }

        let assignedDriver = null;

        if (bookingType === 'RIDE') {
            const availableDriver = await driverModel.findOneAndUpdate(
                { status: 'AVAILABLE', currentCarId: null },
                { status: 'ON_RIDE', currentCarId: carRequest.carId },
                { new: true }
            );

            if (!availableDriver) {
                throw new Error(`No available driver for car ${car.model}`);
            }

            assignedDriver = availableDriver._id;
        }

        validatedCars.push({
            carId: carRequest.carId,
            driverId: assignedDriver,
            status: 'CONFIRMED'
        });
    }

    let totalAmount = 0;
    if (bookingType === 'RIDE') {
        totalAmount = cars.length * 100;
    } else {
        const days = 1; 
        for (const carRequest of cars) {
            const car = await carModel.findById(carRequest.carId);
            totalAmount += car.pricePerDay * days;
        }
    }

    const booking = await bookingModel.create({
        userId,
        bookingType,
        startTime,
        endTime: bookingData.endTime,
        pickupLocation,
        dropoffLocation,
        totalAmount,
        status: 'CONFIRMED',
        cars: validatedCars
    });

    for (const carBooking of validatedCars) {
        await carModel.findByIdAndUpdate(carBooking.carId, {
            status: bookingType === 'RIDE' ? 'ON_RIDE' : 'RENTED'
        });
    }

    return await booking.populate([
        { path: 'userId', select: 'fullname email phone' },
        { path: 'cars.carId', select: 'model licensePlate capacity' },
        { path: 'cars.driverId', select: 'licenseNumber', populate: { path: 'userId', select: 'fullname phone' } }
    ]);
};

export const getBookingById = async (bookingId) => {
    const booking = await bookingModel.findById(bookingId)
        .populate('userId', 'fullname email phone')
        .populate('cars.carId', 'model licensePlate capacity')
        .populate({
            path: 'cars.driverId',
            select: 'licenseNumber',
            populate: { path: 'userId', select: 'fullname phone' }
        });
    
    if (!booking) {
        throw new Error('Booking not found');
    }

    return booking;
};

export const getUserBookings = async (userId, bookingType = null) => {
    const query = { userId };
    if (bookingType) query.bookingType = bookingType;

    return await bookingModel.find(query)
        .populate('cars.carId', 'model licensePlate')
        .populate({
            path: 'cars.driverId',
            select: 'licenseNumber',
            populate: { path: 'userId', select: 'fullname phone' }
        })
        .sort({ createdAt: -1 });
};

export const updateBookingStatus = async (bookingId, status) => {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    booking.status = status;

    if (status === 'COMPLETED' || status === 'CANCELLED') {
        for (const carBooking of booking.cars) {
            await carModel.findByIdAndUpdate(carBooking.carId, {
                status: 'AVAILABLE'
            });

            if (carBooking.driverId) {
                await driverModel.findByIdAndUpdate(carBooking.driverId, {
                    status: 'AVAILABLE',
                    currentCarId: null
                });
            }
        }

        if (status === 'COMPLETED') {
            booking.endTime = new Date();
        }
    }

    await booking.save();

    return await booking.populate([
        { path: 'userId', select: 'fullname email phone' },
        { path: 'cars.carId', select: 'model licensePlate capacity' },
        { path: 'cars.driverId', select: 'licenseNumber', populate: { path: 'userId', select: 'fullname phone' } }
    ]);
};
