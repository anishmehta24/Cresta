const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authUser, authAdmin } = require('../middleware/auth.middleware');

const {body} = require('express-validator');

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
], userController.loginUser);

router.get('/:id', authUser, userController.getUserProfile);

router.put('/:id', authUser, [
    body('email').optional().isEmail().withMessage('Please enter a valid email address'),
    body('fullname.firstname').optional().isLength({min: 2}).withMessage('First name must be at least 2 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Please enter a valid phone number'),
], userController.updateUserProfile);

router.delete('/:id', authUser, userController.deleteUser);

module.exports = router;