const { reject } = require("bcrypt/promises")
const { response } = require("express")
const async = require("hbs/lib/async")
const cartModel = require("../model/cart-model")
const orderModel = require("../model/order-model")
const productController = require("../controllers/product-Controller")
const cartController = require('../controllers/cart-Controller')
const userModel = require('../model/usermodel')


module.exports = {

    addOrders: (user, coupon) => {
        console.log(user);
        console.log(coupon);
        return new Promise((res, rej) => {
            cartController.addProductDetails(user).then((cartdetails) => {
                cartController.getTotalAmount(user).then((totalamount) => {
                    console.log(cartdetails);
                    console.log(totalamount);

                    var order = orderModel({
                        userId: user,
                        paymentMethod: coupon.paymentdetails,
                        address: coupon.address,
                        paymentStatus: "pending",
                        orderStatus: true

                    })
                    order.save().then(async (orderreport) => {
                        console.log(orderreport, 'order ki report');
                        res(order)
                    })
                })
            })

        })
    },


    checkout: async (data, cb) => {
        console.log("vannach", data);
        const status = data.paymentMethod === "COD"
        ? "placed"
        : "pending";

        try {
           
            if (data.coupen) {
                coupen = data.coupen[0].name;
                discount = data.coupen[0].Discountprice
                coupenid = data.coupen[0]._id
                await userModel.findOneAndUpdate({ _id: data.userid }, { $push: { coupons: coupenid } })
            } else {
                coupen = null
                discount = 0
            }
            
            let date = new Date();
            date = date.toUTCString();
            date = date.slice(5, 16);
            const orderDetails = {
                userId: data.userid,
                products: data.cartData,
                totalCost: data.cartTotal,
                coupon: coupen,
                discount: discount,
                finalCost: data.Final_total,
                paymentMethod: data.paymentMethod,
                address: data.address,
                paymentStatus: status,
                orderStatus: "Pending",
                date: date,
            };
            const newOrder = new orderModel(orderDetails);
            await newOrder.save().then((response) => {
                console.log(response, "aa");
                cb(response)
            })
        }
        catch (err) {
            cb(err)
        }
    },

    getOrderList: (orderid) => {
        return new Promise(async (res, rej) => {
            console.log(orderid);
            let orders = await orderModel.findById(orderid)
                .populate('address')
                .populate({ path: 'products', populate: "productId" })
                .lean()

            res(orders)

        })
    },


    getAllOrderList: (userid) => {
        console.log(userid, 'getallorderlist ki user');
        return new Promise(async (res, rej) => {
            console.log(userid);
            let orders = await orderModel.find({ userId: userid })
                .populate({ path: 'products', populate: "productId" })
                .populate('address').lean()
            res(orders)

        })
    },

    getAllOrderData: () => {
        return new Promise(async (resolve, reject) => {
            const orders = await orderModel.find()
                .populate({ path: 'products', populate: "productId" })
                .populate('address')
                .populate('userId')
                .lean()
            resolve(orders)
        })
    },

    shiporder: (orderid) => {
        return new Promise(async (resolve, reject) => {
            try {
                await orderModel.findByIdAndUpdate({ _id: orderid }, { orderStatus: 'Shipped' }).then((response) => {
                    resolve(response)
                })


            }
            catch (error) {
                reject(error)
            }
        })
    },
    delivered: (orderid) => {
        return new Promise(async (resolve, reject) => {
            try {
                await orderModel.findByIdAndUpdate({ _id: orderid }, { orderStatus: 'Delivered' }).then((response) => {
                    resolve(response)
                })


            }
            catch (error) {
                reject(error)
            }
        })
    },

    cancelorder: (orderid) => {
        return new Promise(async (resolve, reject) => {
            try {
                await orderModel.findByIdAndUpdate({ _id: orderid }, { orderStatus: 'Cancelled' }).then((response) => {
                    resolve(response)
                })


            }
            catch (error) {
                reject(error)
            }
        })
    },

    salestoday: () => {
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
        var today = new Date()

        var newdate = today.toUTCString()
        console.log(newdate, "new today");
        newdate = newdate.slice(5, 16);
        let response = {}

        return new Promise(async (resolve, reject) => {
            try {
                await orderModel.find({ date: newdate }).lean()
                    .populate({ path: 'products', populate: "productId" })
                    .populate('userId').then((todayorder) => {
                        console.log(todayorder, "todaysorder");
                        let ordertoday = todayorder
                        let todayrsale = ordertoday.reduce((accumulator, object) => {
                            return accumulator + object.finalCost
                        }, 0)
                        console.log(todayrsale, 'revenue today.,.,.,.,.,.,.,.,.,.,')
                        response.orderstoday = ordertoday
                        response.todaysale = todayrsale

                        resolve(response);
                    })
            } catch (error) {
                reject(error)
            }
        })
    },

    ordersAll: () => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            try {
                await orderModel.find().lean().populate('products.productId').populate('userId').then((allorders) => {
                    orderModel.find({ orderStatus: "Cancelled" }).lean().then((cancelled) => {
                        orderModel.find({ orderStatus: "Delivered" }).lean().then((delivered) => {
                            orderModel.find({ paymentMethod: "COD" }).lean().then((cod) => {
                                orderModel.find({ paymentMethod: "netbanking" }).lean().then((online) => {
                                    let allsale = allorders.reduce((accumulator, object) => {
                                        return accumulator + object.finalCost
                                    }, 0)
                                    totalorderscount = allorders.length
                                    response.allorders = allorders
                                    response.allsale = allsale
                                    response.ordercount = totalorderscount
                                    response.cancelledorders = cancelled.length
                                    response.deliveredorders = delivered.length
                                  

                                    resolve(response);
                                    codcount = cod.length
                                    onlinecount = online.length
                                    response.cod = codcount
                                    response.online = onlinecount
                                })
                            })



                        })
                    })


                })
            } catch (error) {
                reject(error)
            }
        })
    },



}



