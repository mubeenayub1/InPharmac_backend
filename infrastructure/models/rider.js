const mongoose = require("mongoose");

const riderSchema = mongoose.Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone_number: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },
    cnic_front: {
        type: String,
        default: ""
    },
    cnic_back: {
        type: String,
        default: ""
    },
    license_image: {
        type: String,
        default: ""
    },
    license_number: {
        type: String,
        default: ""
    },
    selfie: {
        type: String,
        default: ""
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    status: {
        type: Boolean,
        default: false
    },
    fcmToken: {
        type: String,
        default: ""
    },
},{ timestamps: true });

module.exports = mongoose.model("Rider", riderSchema);
