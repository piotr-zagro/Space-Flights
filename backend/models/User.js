const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
    },
    password: {
        type: String,
    },
    name: {
        type: String,
    },
    lastname: {
        type: String,
    },
    sex: {
        type: String,
    },
    country: {
        type: String,
    },
    notes: {
        type: String,
    },
    birth: {
        type: Date,
    },
    flights: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Flight',
    }],
});

const User = module.exports = mongoose.model('User', UserSchema);
