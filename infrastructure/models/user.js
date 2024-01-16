const mongoose = require("mongoose");
const deliveryAddress = require("./deliveryAddress");

const userSchema = mongoose.Schema({
    phoneNo: {
        type: String,
        default: ""
    },
    fcmToken: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    deliveryAddress: {
        type: [deliveryAddress.schema],
        default: []
    },
    regionArea: {
        type: String,
        default: ""
    },
    HouseNo: {
        type: String,
        default: ""
    },
    StreetNumber: {
        type: String,
        default: ""
    },
    referralId: {
        type: String,
        default: ""
    },
    blocked: {
        type: Boolean,
        default: false
    },
    wallet: {
        type: Number,
        default: 0
    },
    newUser: {
        type: Boolean,
        default: true
    },
    referralEarning: {
        type: String
    },
    favoritePharmacies: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy" }],
        default: []
    },
    type:{
        type: String,

    }
});

module.exports = mongoose.model("User", userSchema);
