import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bookingType: {
        type: String,
        enum: ["RIDE", "RENTAL"],
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "ONGOING", "COMPLETED", "CANCELLED"],
        default: "PENDING"
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date
    },
    pickupLocation: {
        address: String,
        coordinates: {
            type: [Number], // [lng, lat]
            index: "2dsphere"
        }
    },
    dropoffLocation: {
        address: String,
        coordinates: {
            type: [Number],
            index: "2dsphere"
        }
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    cars: [
        {
            carId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Car",
                required: true
            },
            driverId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Driver"
            },
            status: {
                type: String,
                enum: ["PENDING", "CONFIRMED", "ONGOING", "COMPLETED", "CANCELLED"],
                default: "PENDING"
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
