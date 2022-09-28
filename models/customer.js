var mongoose=require("mongoose");

var customerSchema=new mongoose.Schema({
    name:{type:String},
    refno:Number,
    city:String,
    bills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    mobile:{type:String,unique:true,sparse:true},
    paidbills:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }]
})

module.exports=mongoose.model("Customer",customerSchema);