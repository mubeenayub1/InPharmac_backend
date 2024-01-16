const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
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
    image: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Admin", adminSchema);
