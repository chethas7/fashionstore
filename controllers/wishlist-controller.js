const { reject } = require('bcrypt/promises');
const async = require('hbs/lib/async');
const { Promise } = require('mongoose');
const { response } = require('../app');
const wishlistModel = require('../model/wishlist-model')

module.exports = {

addwishlist: (userid, productid) => {
    console.log('productID:',productid);
    console.log('userID:',userid);
        const response = {
            duplicate: false
        }
        return new Promise(async (res, rej) => {
            try {
                let wishlist = await wishlistModel.findOne({ userId: userid })
                if (wishlist) {
                    let wishProducts = await wishlistModel.findOne({
                        userId: userid,
                        'wishlistData.productId': productid
                    })
                    console.log(wishlist,'wishlisttttttttttttttttttttttttttttttttttttttttttttttttttttttttt');
                    if (wishProducts) {
                        console.log("ethi");
                        response.duplicate = true
                        res(response)
                    } else {
                        let wishArray = { productId: productid }
                        wishlistModel.updateOne({ userId: userid },
                            { $push: { wishlistData: wishArray } }).then((response) => {
                                console.log(response.duplicate,'duplicateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                                res(response)
                            })
                    }
                } else {
                    let wishlistObj = new wishlistModel({
                        userId: userid,
                        wishlistData: [{ productId: productid }],
                    })
                    wishlistObj.save().then((response) => {
                        res(response)
                    }).catch((err) => {
                        console.log("error", err);

                    })
                }
            } catch (error) {
                reject(error)
            }
        })
    },


    addItems:(userid)=>{
        try{
            return new Promise(async(res,rej)=>{
                const response={}
                wishlistModel.findOne({userId:userid}).populate('wishlistData.productId').lean().then((list)=>{
                    if(list){
                        if(list.wishlistData.length > 0){
                            response.wishlistempty = false
                            response.list=list
                            res(response)
                        }else{
                            response.wishlistempty=true
                            res(response)
                        }
                    }else{
                        response.wishlistempty=true
                        res(response)
                    }
                })
            })
        }catch(error){
            rej(error)
        }
    },

    deleteItem:(userid,productid)=>{
        console.log(userid,'zainiiiiiiiiiiiiiiiiiiiiiiiiiiiiii userrrrrrrrrrrrrr');
        console.log(productid,'zainiiiiiiiiiiiiiiiiiiiii producttttttttttttttttt');
        return new Promise (async(res,rej)=>{
            try{
                await wishlistModel.updateOne({userId:userid},
                    {$pull:{wishlistData:{productId:productid}}}).then((response)=>{
                        res(response)
                    })
            }catch(err){
                rej(error)
            }
        })
    },

    itemCount:(userid)=>{
        return new Promise(async(res,rej)=>{
            let count = 0
            let items = await wishlistModel.findOne({userId:userid})
            if(items){
                count = items.wishlistData.length
               
            }
            console.log(count,'countttttttttttttttttttttttttttttttttttttttttttttttttt');
            res(count)
        })
    },






}
