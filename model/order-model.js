const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({

    userId:{
        type: mongoose.Schema.Types.ObjectId, ref:'user'
    },
    products:[{
        productId :{
            type : mongoose.Schema.Types.ObjectId, ref:'product',
        },
        quantity : Number
        }],
    totalCost:{
        type: Number,
        default:0
    },
    coupon:{
        type: String
        // mongoose.Schema.Types.ObjectId, ref:('coupons')
    },
    discount:{
        type: Number,
        default:0
    },
    finalCost:{
        type: Number,
        default:0
    },
    paymentMethod:{
        type: String
    },
    address:{
        type: mongoose.Schema.Types.ObjectId, ref:('address')
    },
    paymentStatus:{
        type: String,
        default: 'awaiting Payment'
    },
    orderStatus:{
        type: String,
        default: 'Pending'
    },
    date:{
        type: String
    }
},
{timestamps:true})

const orderModel=mongoose.model('order',orderSchema)
module.exports=orderModel