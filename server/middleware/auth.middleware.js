const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

// Authentication middleware
module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

// Admin authorization middleware
module.exports.authAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};

// Driver authorization middleware
module.exports.authDriver = async (req, res, next) => {
    try {
        if (req.user.role !== 'driver' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Driver privileges required.' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};
