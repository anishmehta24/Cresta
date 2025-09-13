import * as driverService from '../services/driver.service.js';
import { validationResult } from 'express-validator';

export const createDriver = async (req, res, next) => {
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

export const getAllDrivers = async (req, res, next) => {
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

export const getDriverById = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        const driver = await driverService.getDriverById(driverId);
        res.status(200).json({ driver });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateDriver = async (req, res, next) => {
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

export const deleteDriver = async (req, res, next) => {
    try {
        const driverId = req.params.id;
        const driver = await driverService.deleteDriver(driverId);
        res.status(200).json({ message: 'Driver deactivated successfully', driver });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
