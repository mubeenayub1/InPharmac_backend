const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
    question:{
        type: String,
    },
    answer:{
        type: String,
    },
    status:{
        type: String,
        default: "enable"
    }
});

module.exports = mongoose.model('FAQ', FAQSchema);