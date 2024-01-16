const mongoose = require('mongoose');

const commissionSchema = mongoose.Schema({
    orderType:{
        type:String,
        default:""
    },
    orderMethod:{
        type:String,
        default:""
    },
    pictures:{
        type:Array,
        default:[]
    },
    prescriptionAvailability:{
        type:String,
        default:""
    },
    Age:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        default:""
    },
    medicineQuantity:{
        type:String,
        default:""
    },
    distance:{
        type:String,
        default:""
    },
    commissionPercentage:{
        type:String,
        default:""
    },
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }
});

module.exports = mongoose.model("Commission", commissionSchema);