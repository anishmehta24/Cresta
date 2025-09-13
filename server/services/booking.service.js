import bookingModel from '../models/booking.model.js';
import carModel from '../models/car.model.js';
import driverModel from '../models/driver.model.js';

export const createBooking = async (bookingData) => {
    const { userId, bookingType, startTime, pickupLocation, dropoffLocation, cars } = bookingData;

    if (!userId || !bookingType || !startTime || !cars || cars.length === 0) {
        throw new Error('Required fields are missing');
    }

    // Validate and assign cars
    const validatedCars = [];
    
    for (const carRequest of cars) {
        const car = await carModel.findById(carRequest.carId);
        if (!car) {
            throw new Error(`Car with ID ${carRequest.carId} not found`);
        }
        
        if (car.status !== 'AVAILABLE') {
            throw new Error(`Car ${car.model} (${car.licensePlate}) is not available`);
        }

        // For rides, assign an available driver
        let assignedDriver = null;
        if (bookingType === 'RIDE') {
            const availableDriver = await driverModel.findOne({ 
                status: 'AVAILABLE',
                currentCarId: { $in: [null, carRequest.carId] }
            });
            
            if (!availableDriver) {
                throw new Error(`No available driver for car ${car.model}`);
            }
            
            assignedDriver = availableDriver._id;
        }

        validatedCars.push({
            carId: carRequest.carId,
            driverId: assignedDriver,
            status: 'PENDING'
        });
    }

    // Calculate total amount (simplified calculation)
    let totalAmount = 0;
    if (bookingType === 'RIDE') {
        // For rides, calculate based on distance (simplified)
        totalAmount = cars.length * 100; // Base fare per car
    } else {
        // For rentals, calculate daily rate
        const days = 1; // Simplified - could calculate from startTime/endTime
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
        cars: validatedCars
    });

    // Update car and driver statuses
    for (const carBooking of validatedCars) {
        await carModel.findByIdAndUpdate(carBooking.carId, {
            status: bookingType === 'RIDE' ? 'ON_RIDE' : 'RENTED'
        });

        if (carBooking.driverId) {
            await driverModel.findByIdAndUpdate(carBooking.driverId, {
                status: 'ON_RIDE',
                currentCarId: carBooking.carId
            });
        }
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
    if (bookingType) {
        query.bookingType = bookingType;
    }

    const bookings = await bookingModel.find(query)
        .populate('cars.carId', 'model licensePlate')
        .populate({
            path: 'cars.driverId',
            select: 'licenseNumber',
            populate: { path: 'userId', select: 'fullname phone' }
        })
        .sort({ createdAt: -1 });
    
    return bookings;
};

export const updateBookingStatus = async (bookingId, status) => {
    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
        throw new Error('Booking not found');
    }

    booking.status = status;
    
    // Update car status based on booking status
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
