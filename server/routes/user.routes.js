import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authUser, authAdmin } from '../middleware/auth.middleware.js';
import { body } from 'express-validator';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('phone').isLength({min: 10}).withMessage('Phone number must be at least 10 characters long'),
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/:id', authUser, userController.getUserProfile);

router.put('/:id', authUser, [
    body('email').optional().isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').optional().isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('phone').optional().isLength({min: 10}).withMessage('Please enter a valid phone number'),
], userController.updateUserProfile);

router.get('/:id/stats', authUser, userController.getUserStats);

router.delete('/:id', authUser, userController.deleteUser);

export default router;