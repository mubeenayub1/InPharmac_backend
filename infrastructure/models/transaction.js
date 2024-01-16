const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    },
    amount: {
        type: String
    },
    receivedDate: {
        type: Date
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    },
    paymentMethod: {
        type: String
    }
});

module.exports = mongoose.model("Transaction", transactionSchema);
