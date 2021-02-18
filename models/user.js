const mongoose = require('mongoose');
const User = mongoose.model('Appusers', {
    useremail: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userage: {
        type: String,
        required: true
    },
    useraddress: {
        type: String,
        required: true
    },
    expoPushToken: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        required: true
    },
    contactnumber: {
        type: Number,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    noofex: {
        type: Number,
        required: true
    }
})

module.exports = User