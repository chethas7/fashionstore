const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const CouponSchema = new mongoose.Schema({
    userId:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    CouponName:{
        type:String
    },
    CouponCode:{
        type:String
    },
    DiscountPrice:{
        type:'number'
    },
    CouponLimit:{
        type:'number'
    },
    Date:{
        type:'String'
    }
})

const couponModel = mongoose.model('coupon',CouponSchema)
module.exports = couponModel