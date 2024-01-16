const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    type:{
        type: String,
    },
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    images:{
        type: Array,
    },
    platformCharges:{
        type: Number,
    }
});

module.exports = mongoose.model('Categories', categoriesSchema);