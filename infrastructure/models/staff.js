const mongoose = require("mongoose");

const staffSchema = mongoose.Schema({
    name:{
        type: String,
        default:""
    },
    phoneNumber:{
        type: String,
        default:""
    },
    email:{
        type: String,
        default:""
    },
    password:{
        type: String,
        default:""
    },
    address:{
        type: String,
        default:""
    },
    idCard:{
        type: String,
        default:""
    },
    role:{
        type: String,
        default:""
    }
})

module.exports = mongoose.model("Staff", staffSchema);