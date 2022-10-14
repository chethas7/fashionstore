const mongoose = require('mongoose')

const wishlistSchema = mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    wishlistData:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        }
    }]
},{timestamps:true})

const wishlistModel = mongoose.model('wishlist',wishlistSchema)

module.exports = wishlistModel