const mongoose = require("mongoose");

const pharmacyOrderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    OrderMethod: {
        type: String,
        default:""
    },
    
    paymentMethod: {
        type: String,
        default:""
    },
    OrderStatus: {
        type: String,
        default:"pending"
    },
    images: {
        type: Array
    },
    prescriptionType: {
        type: String,
        default:""
    },
    currLat: {
        type: String,
        default:""
    },
    currLon: {
        type: String,
        default:""
    },
    currLocation: {
        type: String,
        default:""
    },
    pharmacyId: {
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pharmacy",
           
        },
        default:{}
    },
    voiceMessage: {
        type: String,
        default:""
    },
 
    pharmacyVoice: {
        type: String,
        default:""
    },
    pharmacyVoiceTime: {
        type: String,
        default:""
    },

    pharmaId: {
        type: String,
        default:""
    },
    availability: {
        type: String,
        default:""
    },
    medicineQuantity: {
        type: String,
        default:""
    },
    pharmacyComment: {
        type: String,
        default:""
    },
    
    comments: {
        type: String,
        default:""
    },
    totalPrice: {
        type: String,
        default:""
    }
},{
    timestamps: true
});

module.exports = mongoose.model("pharmacyOrder", pharmacyOrderSchema);

