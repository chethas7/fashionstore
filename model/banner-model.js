const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema ({
    banner_image:{
        type: Array
    },
    banner_name:{
        type: String
    },
    banner_discription:{
        type:String
    }
    

},{timestamps:true})

const bannerModel = mongoose.model('banner',bannerSchema)
module.exports = bannerModel