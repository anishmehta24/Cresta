import * as dashboardService from '../services/dashboard.service.js';

export const getDashboardOverview = async (req, res, next) => {
    try {
        const overview = await dashboardService.getDashboardOverview();
        res.status(200).json({ overview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
