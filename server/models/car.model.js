const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true
    },
    licensePlate: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, "Car must have at least 1 seat"]
    },
    status: {
        type: String,
        enum: ["AVAILABLE", "ON_RIDE", "RENTED", "MAINTENANCE"],
        default: "AVAILABLE"
    },
    pricePerKm: {
        type: Number,
        default: 0
    },
    pricePerDay: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Car = mongoose.model("Car", carSchema);
module.exports = Car;
