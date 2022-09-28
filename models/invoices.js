var mongoose =require("mongoose");

var invoiceSchema=new mongoose.Schema({
    ctpins:[{type:Number}]
});

module.exports=mongoose.model("Invoice",invoiceSchema);