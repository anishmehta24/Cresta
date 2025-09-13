import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
const router = express.Router();

// Get dashboard overview (admin only)
router.get('/overview', authUser, authAdmin, dashboardController.getDashboardOverview);

export default router;
