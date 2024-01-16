const mongoose = require('mongoose');

const smsApiSchema = new mongoose.Schema({
    gatewayName:{
        type: String,
    },
    baseUrl:{
        type: String,
    },
    successCode:{
        type: String,
    }
});

module.exports = mongoose.model('SmsApi', smsApiSchema);