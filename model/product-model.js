const mongoose = require('mongoose')
 
const productSchema = new mongoose.Schema({
    product_name:{
        type:String
    },
    product_discription:{
        type:String
    },
    product_price:{
        type:Number
    },
    product_discount:{
        type:Number
    },
    product_category:{

        type: mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    stock_availability:{
        type:String
    },
    
    image:{
        type:Array
    }


},{timestamps:true})

const productModel = mongoose.model('product',productSchema)
module.exports = productModel;