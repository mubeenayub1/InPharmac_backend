const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        default: ""
    },
    phone_number: {
        type: String,
        default: ""
    },
    OTP: {
        type: String,
        default: ""
    }
},{ timestamps: true });

module.exports = mongoose.model("otp", OTPSchema);
