const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    userId:{
        type: String,
    },
    ticketId: {
        type: String,
    },
    title:{
        type: String,

    },
    subject:{
        type: String,
    },
    priority:{
        type: String,
    },
    status:{
        type: String,
    }
});

module.exports = mongoose.model('Support', supportSchema);