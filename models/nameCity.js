var mongoose =require("mongoose");

var pincodeSchema=new mongoose.Schema({
    detail:[{
        name:String,
        city:String
    }]
});

module.exports=mongoose.model("nameCity",pincodeSchema);