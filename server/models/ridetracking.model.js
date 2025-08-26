const mongoose = require("mongoose");

const rideTrackingSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },
    currentLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        updatedAt: { type: Date }
    },
    locationHistory: [
        {
            latitude: Number,
            longitude: Number,
            timestamp: Date
        }
    ]
});

const RideTracking = mongoose.model("RideTracking", rideTrackingSchema);
module.exports = RideTracking;
