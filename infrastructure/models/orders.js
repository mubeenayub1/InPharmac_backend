const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    pharmacyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacy"
    },
    orderDate: {
        type: Date,
        default: new Date()
    },
    report: {
        type: [],
        default: []
    },
    injury: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "pending",
    },
    percentageCommission: {
        type: String,
        default: ""
    },
    totalPrice: {
        type: String,
        default: ""
    },
    orderMethod: {
        type: String,
        default: ""
    },
    commissionReceived: {
        type: String,
        default: ""
    },
    orderType: {
        type: String,
        default: ""
    }
},{
    timestamps: true
});

// function getDate(){
//     const currentDate = new Date();
//     const DaysAgo = new Date();
//     DaysAgo.setDate(currentDate.getDate() - 10);
//     return DaysAgo;
// }

module.exports = mongoose.model("Order", orderSchema);

