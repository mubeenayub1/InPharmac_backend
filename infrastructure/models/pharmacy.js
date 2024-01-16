const mongoose = require("mongoose");

const pharmacySchema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    fcmToken: {
        type: String,
        default: ""
    },
    location: {
        type: {
            long: String,
            lat: String,
            location: String
        }
    },
    Address: {
        type: String,
        default: ""
    },
  
    City: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    preferredPaymentMethod: {
        type: String,
        default: ""
    },
    OperatingHours: {
        type: String,
        default: ""
    },
    serviceOptions: {
        type: String,
        default: ""
    },
    commissionPercentage: {
        type: String,
        default: ""
    },
    pharmacyLegalDocumentImages: {
        type: Array,
        default: []
    },
    logo: {
        type: String,
        default: ""
    },
    chargesPerKm: {
        type: {
            km1: String,
            km3: String,
            km6: String
        }
        
    },
    deliverCharges: {
        type: String,
        default: ""
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: "pending"
    },
    blocked:{
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: false
    },
    state: {
        type: String,
        default: "online"
    },
    type: {
        type: String,
        default: ""
    },
});

module.exports = mongoose.model("Pharmacy", pharmacySchema);
