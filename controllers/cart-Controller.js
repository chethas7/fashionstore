const { reject } = require("bcrypt/promises")
const { response } = require("express")
const async = require("hbs/lib/async")
const cartModel = require("../model/cart-model")
const orderModel = require("../model/order-model")
const productController = require("../controllers/product-Controller")

Helpers = {
    addToCart: (productid, userid) => {
        console.log(productid);
        console.log(userid);
        const response = {
            duplicate: false,
        }

        return new Promise(async (res, rej) => {
            try {
                let usercart = await cartModel.findOne({ userId: userid })
                console.log(usercart, 'usercart');
                // console.log(usercart);
                if (usercart) {
                    let cartproduct = await cartModel.findOne({
                        userId: userid,
                        "cartdata.productId": productid,
                    })

                    if (cartproduct) {
                        console.log(cartproduct, 'cartproduct');
                        // console.log(cartproduct);
                        cartModel
                            .updateOne({ userId: userid, "cartdata.productId": productid },
                                { $inc: { "cartdata.$.quantity": 1 } }
                            )
                            .then((response) => {
                                console.log(response, 'response');
                                response.duplicate = true
                                res(response)
                            })

                    } else {
                        let cartArray = { productId: productid, quantity: 1 }
                        cartModel.findOneAndUpdate({ userId: userid }, {
                            $push: { cartdata: cartArray },
                        }
                        )
                            .then((data) => {
                                res(response)
                            })
                    }
                } else {
                    let body = {
                        userId: userid,
                        cartdata: [{ productId: productid, quantity: 1 }],
                    }
                    await cartModel.create(body)
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    addProductDetails: (userid) => {
        try {
            return new Promise(async (res, rej) => {
                const response = {}
                await cartModel
                    .findOne({ userId: userid })
                    .populate('cartdata.productId')
                    .lean().then((cart) => {
                        if (cart) {
                            if (cart.cartdata.length > 0) {
                                response.cartempty = false
                                response.cart = cart
                                res(response)
                            } else {
                                response.cartempty = true
                                response.cart = cart
                                res(response)
                            }
                        } else {
                            response.cartempty = true
                            res(response)
                        }
                    })
            })
        } catch (error) {
            rej(error)
        }
    },

    deleteCart: (userid, productid) => {
        return new Promise((res, rej) => {
            try {
                cartModel.findOneAndUpdate({ userId: userid }, {
                    $pull: {
                        cartdata: { productId: productid }
                    }
                }).then((data) => {
                    res(data)
                })
            } catch (error) {
                rej(error)
            }
        })
    },

    changeCartQty: async (data, cb) => {
        await cartModel
            .updateOne(
                { userId: data.userid, "cartdata.productId": data.productid },
                { "cartdata.$.quantity": data.value }).then((data) => {
                    console.log("reached");
                    let taskData = true;
                    cb(null, data);
                }).catch((err) => {
                    console.log("errror occured in cartQty Change");
                    cb(err, null);
                })


    },
    decrementQty: (productid, userid) => {
        return new Promise(async (res, rej) => {
            cartModel.updateOne({ userId: userid, 'cartdata.productId': productid }, { $inc: { 'cartdata.$.quantity': -1 } }).then(async (response) => {
                let cart = await cartModel.findOne({ userId: userid })
                let quantity;
                for (let i = 0; i < cart.cartdata.length; i++) {
                    if (cart.cartdata[i].productId == productid) {
                        quantity = cart.cartdata[i].quantity
                    }
                }

                response.quantity = quantity
                res(response)
            })
        })
    },

    totalItem: (userid) => {
        return new Promise(async (res, rej) => {
            try {
                let cart = await cartModel.findOne({ userId: userid })
                if (cart) {
                    let itemCount = 0
                    itemCount = cart.cartdata.length
                    res(itemCount)
                } else {
                    itemCount = 0
                    res(itemCount)
                }

            } catch (error) {
                rej(error)
            }
        })
    },
    getTotalAmount: (async (id, cb) => {
        cartModel.findOne({ user_id: id }).populate('Cartdata.productId').lean().then((data) => {
            let cartlength = data.Cartdata.length
            let total = null;


            if (cartlength >= 0) {
                total = data.Cartdata.reduce((acc, curr) => {
                    acc += curr.productId.product_price * curr.quantity;
                    return acc;
                }, 0);

                cb(null, total);
            } else {
                cb(null, total);
            }

        }).catch((err) => {
            console.log("error occured in get total", err);
            cb(err, null);
        })


    }),





    getTotalAmount: (userid) => {
        console.log(userid, 'user keeeeeee iddddd pe  cart ki controller');
        try {
            return new Promise(async (resolve, reject) => {
                Helpers.addProductDetails(userid).then((res) => {
                    console.log(res, 'naaaaaaaaaaaaaaaaaaaajjjjjjjjjjjjjjiiiiiiiiiiiiiii');
                    let response = {}
                    cart = res.cart
                    let total;

                    if (cart) {
                        console.log(cart, 'cart ki inside pe');
                        let cartlength = cart.cartdata.length
                        console.log(cart.cartdata, 'cartlength-------------------------------------------length');
                        if (cartlength >= 0) {
                            total = cart.cartdata.reduce((acc, crr) => {
                                acc += crr.productId.product_price * crr.quantity
                                return acc
                            }, 0)
                            resolve(total)
                        } else {
                            response.cartempty = true
                            resolve(response)
                        }
                    }
                })
            })
        } catch (error) {
            reject(error)
        }
    },

    getTotalDiscount: (userid) => {
        console.log(userid);
        try {
            return new Promise(async (res, rej) => {
                Helpers.addProductDetails(userid).then((resp) => {
                    let response = {}
                    cart = resp.cart
                    console.log(cart,'its a cart in 555555555555');

                    let TotalDiscount

                    if (cart) {
                        let cartlength = cart.cartdata.length

                        if (cartlength >= 0) {
                            TotalDiscount = cart.cartdata.reduce((acc, curr) => {
                                acc += curr.productId.product_price * curr.quantity
                                return acc
                            }, 0)
                            console.log(TotalDiscount);
                            res(TotalDiscount)
                        }

                    } else {
                        console.log('error');
                        (response.cartempty = true),
                            res(response)
                    }
                })
            })
        } catch (err) {
            rej(err)
        }

    },

    cartCount: (userid) => {
        return new Promise(async (res, rej) => {
            console.log(userid);
            let count = 0
            let cart = await cartModel.findOne({ userId: userid })
            if (cart) {
                // console.log(cart);
                count = cart.cartdata.length
            }
            // console.log(count);
            res(count)
        })
    }
}

module.exports = Helpers;