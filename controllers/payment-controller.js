const Razorpay = require('razorpay')
const dotenv = require('dotenv')
var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret
});

module.exports = {

    generateRazorpay: (orderid, totalprice) => {

        console.log(totalprice, 'price of total');
        return new Promise((res, rej) => {
            var options = {
                amount: totalprice,  // amount in the smallest currency unit
                currency: "INR",
                receipt: '' + orderid
            };
            instance.orders.create(options, function (err, order) {
                console.log(order, 'order of razorpay');
                res(order)
            });

        })
    },

 razorpayPayment: (order) => {
        var options = {
            "key": "rzp_test_iTDo89He1ttYwa", // Enter the Key ID generated from the Dashboard
            "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000
            paise,
             "currency": "INR",
            "name": "Snow Flakes",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id, //This is a sample Order ID. Pass the id obtained in the response of Step 1
            "handler": function (response) {


                verifyPayment(response, order)
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.open();
    },


    // const verifyPayment = async (payment, order) => {
    //     try {

    //         const res = await axios.post('/verifyPayment', {
    //             payment,
    //             order
    //         }).then((e) => {
    //             console.log(e, "e response")
    //             if (e.data.status) {
    //                 location.href = /order/${ order.receipt };
    //             } else {
    //                 alert("payment failed!")
    //             }
    //         })
    //     } catch (error) {
    //         console.log(error, "error founded")
    //     }
    // }

}