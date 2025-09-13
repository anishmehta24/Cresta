import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "ON_RIDE", "OFFLINE"],
        default: "AVAILABLE"
    },
    currentCarId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
