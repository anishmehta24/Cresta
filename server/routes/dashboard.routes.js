const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authUser, authAdmin } = require('../middleware/auth.middleware');

// Get dashboard overview (admin only)
router.get('/overview', authUser, authAdmin, dashboardController.getDashboardOverview);

module.exports = router;
