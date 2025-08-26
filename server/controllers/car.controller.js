const carService = require('../services/car.service');
const { validationResult } = require('express-validator');

module.exports.createCar = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const car = await carService.createCar(req.body);
        res.status(201).json({ car });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getAllCars = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            capacity: req.query.capacity ? parseInt(req.query.capacity) : null
        };

        const cars = await carService.getAllCars(filters);
        res.status(200).json({ cars });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getCarById = async (req, res, next) => {
    try {
        const carId = req.params.id;
        const car = await carService.getCarById(carId);
        res.status(200).json({ car });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.updateCar = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const carId = req.params.id;
        const car = await carService.updateCar(carId, req.body);
        res.status(200).json({ car });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteCar = async (req, res, next) => {
    try {
        const carId = req.params.id;
        const car = await carService.deleteCar(carId);
        res.status(200).json({ message: 'Car marked as under maintenance', car });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
