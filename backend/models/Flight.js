const mongoose = require('mongoose');

const FlightSchema = mongoose.Schema({
    departure: {
        type: Date,
    },
    arrival: {
        type: Date,
    },
    seats: {
        type: Number,
    },
    price: {
        type: Number,
    },
    tourists: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }],
});

const Flight = module.exports = mongoose.model('Flight', FlightSchema);
