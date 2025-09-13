import userModel from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, phone, password } = req.body;

        const hashedPassword = await userModel.hashPassword(password);

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            phone,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(201).json({
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = user.generateAuthToken();

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        // Users can only access their own profile unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await userService.getUserById(userId);
        res.status(200).json({ user });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const userId = req.params.id;
        
        // Users can only update their own profile unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await userService.updateUser(userId, req.body);
        res.status(200).json({ user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        // Users can only delete their own account unless they're admin
        if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const user = await userService.deleteUser(userId);
        res.status(200).json({ message: 'User account deactivated successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};