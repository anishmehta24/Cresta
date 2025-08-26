const carModel = require('../models/car.model');

module.exports.createCar = async ({ model, licensePlate, capacity, pricePerKm, pricePerDay }) => {
    if (!model || !licensePlate || !capacity) {
        throw new Error('Model, license plate, and capacity are required');
    }

    const existingCar = await carModel.findOne({ licensePlate });
    if (existingCar) {
        throw new Error('Car with this license plate already exists');
    }

    const car = await carModel.create({
        model,
        licensePlate,
        capacity,
        pricePerKm: pricePerKm || 0,
        pricePerDay: pricePerDay || 0
    });

    return car;
};

module.exports.getAllCars = async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
        query.status = filters.status;
    }
    
    if (filters.capacity) {
        query.capacity = { $gte: filters.capacity };
    }

    const cars = await carModel.find(query);
    return cars;
};

module.exports.getCarById = async (carId) => {
    const car = await carModel.findById(carId);
    if (!car) {
        throw new Error('Car not found');
    }
    return car;
};

module.exports.updateCar = async (carId, updateData) => {
    const car = await carModel.findByIdAndUpdate(
        carId,
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!car) {
        throw new Error('Car not found');
    }
    
    return car;
};

module.exports.deleteCar = async (carId) => {
    const car = await carModel.findByIdAndUpdate(
        carId,
        { status: 'MAINTENANCE' },
        { new: true }
    );
    
    if (!car) {
        throw new Error('Car not found');
    }
    
    return car;
};
