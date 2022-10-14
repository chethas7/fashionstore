const { promise } = require('bcrypt/promises');
const async = require('hbs/lib/async');
const { Promise } = require('mongoose');
const { response } = require('../app');
const couponModel = require('../model/coupen-model');
const categoryController = require('./category-Controller');
const cartController = require('../controllers/cart-Controller')
const productController = require('../controllers/product-Controller')

module.exports = {

    addCoupon: (couponData) => {
        return new Promise(async (res, rej) => {
            console.log(couponData, 'data of couponzzzzzzzzzzzzzzzzzzzzzz');
            let coupon = new couponModel({
                CouponName: couponData.couponName,
                CouponCode: couponData.couponCode,
                DiscountPrice: couponData.discountPrice,
                CouponLimit: couponData.couponLimit,
                Date: new Date(),
            })
            coupon.save().then((coupon) => {
                res(coupon)
            })
        })
    },


    getCoupon: () => {
        console.log("coupon at controller");
        return new Promise(async (res, rej) => {
            let response = {}
            let coupon = await couponModel.find({}).lean()
            console.log(coupon, 'coupppppppppppp-adarsh..................');
            response = coupon
            res(response)
        })

    },

    deleteCoupon: (couponId) => {
        return new Promise(async (res, rej) => {
            couponModel.findByIdAndDelete({ _id: couponId }).then((response) => {
                res(response)
            })
        })
    },

    getCouponValue: (couponId) => {
        return new Promise(async (res, rej) => {
            let response = {}
            let coupon = await couponModel.findOne({ _id: couponId }).lean()
            response = coupon
            res(response)
        })
    },

    updateCoupon: (couponId, couponData) => {
        return new Promise(async (res, rej) => {
            couponModel.findByIdAndUpdate(couponId, {
                CouponName: couponData.couponName,
                CouponCode: couponData.couponCode,
                DiscountPrice: couponData.discountPrice,
                CouponLimit: couponData.couponLimit,
            }).then((response) => {
                res(response)
            })

        })

    },

    applyCoupon: (userid, coupondata) => {
        console.log(userid, 'userid------------------------------2');
        console.log(coupondata, 'productid------------------------3');
        return new Promise(async (res, rej) => {
            try {
                let response = {}
                response.discount = 0
                let coupon = await couponModel.findOne({
                    CouponCode: coupondata.code
                })

                console.log(coupon, 'coupondata...............................4');
                cartController.getTotalAmount(userid).then(async (totalamount) => {
                    console.log(totalamount, 'total amount5555555555555555555555555555555555555555555');

                    if (coupon) {
                        response.coupon = coupon
                        let couponUser = await couponModel.findOne({
                            CouponCode: coupondata.code,
                            userId: { $in: [userid] },


                        })
                        if (coupon.CouponLimit <= totalamount) {
                            console.log(coupon.CouponLimit, 'coupon limit inside the coupon data');
                            response.status = true

                            if (couponUser) {
                                console.log(couponUser, 'coupon ki user--000000000000000077777777777');
                                response.status = false
                                res(response)

                            } else {
                                response.status = true
                                response.coupon = response
                                console.log('adarsh ki coupon....................................!');
                                cartController.addProductDetails(userid).then((cartProduct) => {
                                    console.log(cartProduct, 'cartz------------------------product');
                                    cartController.getTotalDiscount(userid).then((totaldiscount) => {
                                        console.log(totaldiscount, 'total discount...............................5');

                                        cart = cartProduct.cart

                                        let grandtotal
                                        if (cart) {
                                            let cartlength = cart.cartdata.length
                                            console.log(cart.cartdata, 'cart ki length.............555');
                                            if (cartlength >= 0) {
                                                grandtotal = cart.cartdata.reduce((acc, curr) => {
                                                    acc += curr.productId.product_price * curr.quantity
                                                    console.log(grandtotal, "grandtoal is her may be gey");
                                                    return acc


                                                }, 0)
                                                if (coupon.DiscountPrice <= coupon.couponLimit) {
                                                    coupon.DiscountPrice = coupon.DiscountPrice

                                                } else {
                                                    coupon.DiscountPrice = coupon.couponLimit
                                                }
                                                grandtotal = grandtotal - coupon.DiscountPrice
                                                console.log(grandtotal, "grandddduuuuuuuuuuuuuuuuuu");
                                                response.grandtotal = grandtotal
                                                response.coupon = coupon
                                                res(response)
                                                console.log(response, "grand total.................147");
                                            } else {
                                                res(response)
                                            }
                                        } else {
                                            res(response)
                                        }
                                    })



                                })

                            }

                        } else {
                            response.status = false
                            res(response)
                            console.log(response);
                        }
                    } else {
                        response.status = false
                        res(response)
                    }
                })


            } catch (error) {
                rej(error)
            }
        })
    },

    couponUser: (userid, coupon) => {
        console.log(userid, coupon, 'coupon ki user 123');
        return new Promise(async (res, rej) => {
            try {
                let coupons = await couponModel.findOne({
                    CouponCode: coupon.code,

                })

                if (coupons) {
                    await couponModel.findByIdAndUpdate(coupons._id, { $push: { userId: userid } }).then((response) => {
                        console.log(response, 'response......................!');
                        res(response)
                    })
                } else {
                    cartController.getTotalAmount(userid).then((response) => {
                        res(response)
                    })
                }
            } catch (error) {
                rej(error)
            }
        })

    },
   





}