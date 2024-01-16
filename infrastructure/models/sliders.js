const mongoose = require("mongoose");

const sliderSchema = new mongoose.Schema({
    picture: {
        type: String,
        default: ""
    },
    myProfile: {
        type: String,
        default: "demo"
    },
    referralEarning: {
        type: String
    },
    settings: {
        type: String,
        default: "demo"
    },
    deliveryAddress: {
        type: String
    },
    myOrders: {
        type: String,
        default: "demo"
    },
    favorite:{
        type: String,
        default: "demo"
    }
});

module.exports = mongoose.model("Slider", sliderSchema);