const mongoose = require('mongoose');

const Story = mongoose.model('Story', {
    title: {
        type: String,
        sparse: true,
        required: true
    },
    username: {
        type: String,
        sparse: true,
        required: true
    },
    storypara: {
        type: String,
        sparse: true,
        required: true
    },
    useremail: {
        type: String,
        sparse: true,
        required: true
    },
    creatorid: {
        type: Object,
        sparse: true,
        required: true
    }
    // creatorid: { type: mongoose.Schema.Types.ObjectId, ref: "appusers", required: true }
});


module.exports = Story