var mongoose = require("mongoose");

var InventorySchema = mongoose.Schema({
    dateAdded : {type: String, required : true},
    product : [{
        pid : {type: String, required : true},
        name : {type: String},
        desc : {type: String},
        vid : {type: String},
        add : {type: Number, required : true},
        sub : {type: Number, required : true},
    }]
    // product element structure : { pid : X, desc : X1, add : X2, sub : Y, name : Name+VariantName}
})

module.exports = mongoose.model("Inventory", InventorySchema);