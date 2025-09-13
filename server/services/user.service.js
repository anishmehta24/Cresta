import userModel from '../models/user.model.js';

export const createUser = async ({firstname, lastname, email, phone, password}) => {
    if(!firstname || !email || !phone || !password) {
        throw new Error('All fields are required');
    }
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        phone,
        password
    });
    return user;
};

export const getUserById = async (userId) => {
    const user = await userModel.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

export const updateUser = async (userId, updateData) => {
    // Remove sensitive fields that shouldn't be updated via this method
    const { password, role, ...allowedUpdates } = updateData;
    
    const user = await userModel.findByIdAndUpdate(
        userId,
        allowedUpdates,
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
        throw new Error('User not found');
    }
    
    return user;
};

export const deleteUser = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    
    // Soft delete by updating user status or marking as inactive
    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { 
            email: `deleted_${Date.now()}_${user.email}`,
            phone: `deleted_${Date.now()}_${user.phone}`,
            role: 'inactive'
        },
        { new: true }
    ).select('-password');
    
    return updatedUser;
};

export const getAllUsers = async (filters = {}) => {
    const query = {};
    
    if (filters.role) {
        query.role = filters.role;
    }
    
    if (filters.emailVerified !== undefined) {
        query.emailVerified = filters.emailVerified;
    }

    const users = await userModel.find(query).select('-password').sort({ createdAt: -1 });
    return users;
};
