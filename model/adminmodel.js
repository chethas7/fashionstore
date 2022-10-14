const mongoose = require('mongoose')
const bcrypt = require("bcrypt")

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String
})


userSchema.pre('save',async function(next){
    try{
        const hash = await bcrypt.hash(this.password,10);
        this.password=hash;
        next()
    } catch(error) {
        next(error);
    }


})

const adminModel = mongoose.model('admin',userSchema)



module.exports=adminModel