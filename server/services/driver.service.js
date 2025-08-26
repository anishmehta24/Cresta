const driverModel = require('../models/driver.model');
const userModel = require('../models/user.model');

module.exports.createDriver = async ({ userId, licenseNumber }) => {
    if (!userId || !licenseNumber) {
        throw new Error('User ID and license number are required');
    }

    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const existingDriver = await driverModel.findOne({ 
        $or: [{ userId }, { licenseNumber }] 
    });
    if (existingDriver) {
        throw new Error('Driver already exists for this user or license number');
    }

    // Update user role to driver
    await userModel.findByIdAndUpdate(userId, { role: 'driver' });

    const driver = await driverModel.create({
        userId,
        licenseNumber
    });

    return await driver.populate('userId', 'fullname email phone');
};

module.exports.getAllDrivers = async (filters = {}) => {
    const query = {};
    
    if (filters.status) {
        query.status = filters.status;
    }

    const drivers = await driverModel.find(query)
        .populate('userId', 'fullname email phone')
        .populate('currentCarId', 'model licensePlate');
    
    return drivers;
};

module.exports.getDriverById = async (driverId) => {
    const driver = await driverModel.findById(driverId)
        .populate('userId', 'fullname email phone')
        .populate('currentCarId', 'model licensePlate');
    
    if (!driver) {
        throw new Error('Driver not found');
    }
    
    return driver;
};

module.exports.updateDriver = async (driverId, updateData) => {
    const driver = await driverModel.findByIdAndUpdate(
        driverId,
        updateData,
        { new: true, runValidators: true }
    ).populate('userId', 'fullname email phone')
     .populate('currentCarId', 'model licensePlate');
    
    if (!driver) {
        throw new Error('Driver not found');
    }
    
    return driver;
};

module.exports.deleteDriver = async (driverId) => {
    const driver = await driverModel.findByIdAndUpdate(
        driverId,
        { status: 'OFFLINE' },
        { new: true }
    );
    
    if (!driver) {
        throw new Error('Driver not found');
    }
    
    // Update user role back to user
    await userModel.findByIdAndUpdate(driver.userId, { role: 'user' });
    
    return driver;
};
