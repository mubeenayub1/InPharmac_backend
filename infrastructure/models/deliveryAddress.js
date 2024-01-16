const mongoose = require('mongoose');

const deliveryAddressSchema = mongoose.Schema({
    name:{
        type: String,
    },
    location:{
        type: String,
    },
    lat:{
        type: String,
    },
    lng:{
        type: String,
    }
});

module.exports = mongoose.model("deliveryAddress", deliveryAddressSchema);