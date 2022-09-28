var mongoose =require("mongoose");
var shortid =require("shortid");

var enquirySchema =mongoose.Schema({
    qid:{type:String,unique:true,default:shortid.generate},
    username:String,
    isCustomer:{type:Boolean},
    type:{type:String},
    subject:String,
    product:String,
    city:String,
    mobile:String,
    orderid:String,
    message:String,
    isResolved:{type:Boolean,default:false}
})

module.exports=mongoose.model("Enquiry",enquirySchema);