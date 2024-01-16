const mongoose = require("mongoose");

const userOrderSchema = mongoose.Schema({
    userId:{
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    OrderMethod: {
        type: String
    },
    OrderDate: {
        type: Date,
        default: new Date()
    },
    OrderStatus: {
        type: String,
        default: "pending"
    },
    images: {
        type: Array,
        default: []
    },
    voiceMessage: {
        type: String
    },  
    MedicineQuantity: {
        type: String
    },
    comments: {
        type: String
    }
});

module.exports = mongoose.model("userOrder", userOrderSchema);

