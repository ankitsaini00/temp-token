var mongoose =require("mongoose");

var pincodeSchema=new mongoose.Schema({
    codes:[{type:Number}],
    orderids:[{type:Number}],
    add_image:{
        url:String,
        public_id:String
    },
    billno:{type:Number,default:1000},
    refno:{type:Number,default:1000},
    billName : [{type:String}],
    voucherDate : {
        min : {type:Number,default:1},
        max : {type:Number,default:2}
    }
});

module.exports=mongoose.model("Pincode",pincodeSchema);