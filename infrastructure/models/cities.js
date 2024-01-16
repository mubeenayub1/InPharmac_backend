const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    name: {
        type: String,
        default:""
    }
});

module.exports = mongoose.model('City', citySchema);