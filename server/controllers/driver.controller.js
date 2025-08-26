const driverService = require('../services/driver.service');
const { validationResult } = require('express-validator');

module.exports.createDriver = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const driver = await driverService.createDriver(req.body);
        res.status(201).json({ driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getAllDrivers = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status
        };

        const drivers = await driverService.getAllDrivers(filters);
        res.status(200).json({ drivers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getDriverById = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        const driver = await driverService.getDriverById(driverId);
        res.status(200).json({ driver });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.updateDriver = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const driverId = req.params.id;
        const driver = await driverService.updateDriver(driverId, req.body);
        res.status(200).json({ driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteDriver = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        const driver = await driverService.deleteDriver(driverId);
        res.status(200).json({ message: 'Driver deactivated successfully', driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
