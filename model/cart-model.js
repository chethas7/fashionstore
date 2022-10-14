const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        require:true
    },
    cartdata:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:'number'
    }]

},{timestamps:true})

const cartModel = mongoose.model('cart',cartSchema)
module.exports = cartModel