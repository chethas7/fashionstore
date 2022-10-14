const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    Name:{
        type:String
    },
    LastName:{
        type:String
    },
    Number:{
        type:'Number'
    },
    Pincode:{
        type:'Number'
    },
    Address:{
        type:String
    },
    Locality:{
        type:'String'
    },
    Housename:{
        type:String
    },
    State:{
        type:String
    },
    LandMark:{
        type:String
    }

})
const addressModel = mongoose.model('address',addressSchema)
module.exports = addressModel