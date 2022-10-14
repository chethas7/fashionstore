var express = require("express");
const session = require("express-session");
const { response, render } = require("../app");
const twilioController = require("../controllers/twilio-controller");
const usercontroller = require("../controllers/usercontroller");
var router = express.Router();
const adminModel = require('../model/adminmodel')
const userModel = require('../model/usermodel')
const userBlocker = require('../middleware/block-user')
const productController = require('../controllers/product-Controller')
const cartController = require('../controllers/cart-Controller');
const async = require("hbs/lib/async");
const wishlistController = require("../controllers/wishlist-controller");
const { itemCount } = require("../controllers/wishlist-controller");
const addressController = require("../controllers/address-Controller");
const cartModel = require("../model/cart-model");
const { Router } = require("express");
const bannerController = require('../controllers/banner-Controller');
const couponController = require("../controllers/coupon-Controller");
const couponModel = require("../model/coupen-model");
const orderController = require("../controllers/order-Controller");
const paymentController = require("../controllers/payment-controller");
const categoryController = require("../controllers/category-Controller");

///////////.......................... S E S S I O N............................................/////////////

let verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()

  } else {
    res.redirect('/')
  }
}

// let itemsCounter = wishlistController.itemCount(req.session.user._id).then(itemsCount)

///////////////.........................H O M E   P A G E....................................////////////////

////GET home page
router.get("/", function (req, res, next) {
  if (req.session.loggedin) {
    let loggedin = req.session.loggedin
    productController.getAllProductData().then((response) => {
      bannerController.getBannerAllData().then((banner) => {
        console.log(banner);
        res.render("user/userhome", { user_header: true, loggedin, response, banner });

      })

    })


  } else {
    req.session.loggedin = false
    bannerController.getBannerAllData().then((banner) => {
      res.render('user/userhome', { user_header: true, response, banner })
    })
  }

});

////////////.............................U S E R ........................//////////////

////User Login
router.get("/login", function (req, res, next) {
  if (req.session.loggedin) {

    res.redirect('/')
  } else {
    let loginerror = req.session.loginerror
    res.render("user/userlogin", { user_header: true, loggedin: true });
  }
});


////user Login Post Method

router.get('/userhome', (req, res) => {

  res.render('user/userhome', { user_header: true })
})


router.post('/login', (req, res) => {
  console.log("1st");

  usercontroller.userlogin(req.body).then((response) => {
    console.log(req.body);
    console.log(response.status);
    if (response.status) {
      req.session.loggedin = true
      req.session.user = response.user
      console.log("login_success")
      res.redirect('/')
    }

    else if (response.usernotfound) {
      req.session.loggedin = false
      req.session.loginerror = true
      console.log('user not found')
      res.render('user/userlogin', { loginerror: req.session.loginerror, user_header: true })
    }

    else {
      console.log('login failed')
      req.session.loggedin = false
      res.redirect('/login')
    }
  })
})





////USER SIGNUP

router.get("/signup", function (req, res, next) {
  res.render("user/usersignup", { user_header: true });
}).post('/signup', async (req, res) => {
  try {
    const newUser = await new userModel(req.body)
    twilioController.sendOtp(req.body.phone)
    req.session.phone = req.body.phone
    newUser.save()

    res.render('user/otp-verify', { user_header: true })
  } catch (error) {
    console.log(error)
  }
})

////OTP POST
router.post('/otpverification', async (req, res) => {
  console.log(req.body);
  const data = await twilioController.verifyOtp(req.session.phone, req.body.otp)
  console.log(data)
  if (data.valid) {
    req.session.loggedin = true
    res.redirect('/')
  } else {
    res.redirect('/signup')
  }
})

////LOG OUT
router.get('/logout', (req, res) => {
  req.session.loggedin = false
  res.redirect('/')
})

///////..............................S H O P P I N G  -   P A G E................................./////////

router.get('/shop-product', (req, res) => {

  if (req.session.loggedin) {
    let loggedin = req.session.loggedin
    productController.getAllProductData().then((response) => {
      categoryController.getcategory().then((category) => {
        console.log(response, 'category8944');
        res.render('user/shop-product', { user_header: true, category, response, loggedin })
      })
    })
  } else {
    productController.getAllProductData().then((response) => {
      categoryController.getcategory().then((category) => {
        res.render('user/shop-product', { user_header: true, response, category })
      })
    })

  }
})

////SHOPPING BY CATEGORY
router.get('/show-product/:_id', (req, res) => {
  console.log(req.params._id, "sgfdfjhpl';lkjhgfdsadadf")
  if (req.session.loggedin) {
    let loggedin = req.session.loggedin
    productController.getCAtegoryData(req.params._id).then((response) => {
      categoryController.getcategorybyID(req.params._id).then((categoryname) => {
        categoryController.getcategory().then((category) => {
          console.log(response, "categoryresponse");
          res.render('user/shop-category', { user_header: true, category, response, loggedin, categoryname })
        })
      })
    })
  } else {
    productController.getCAtegoryData(req.params._id).then((response) => {
      categoryController.getcategory().then((category) => {
        categoryController.getcategorybyID(req.params._id).then((categoryname) => {
          console.log(response, "categoryresponse");
          res.render('user/shop-category', { user_header: true, category, response, categoryname })
        })
      })
    })
  }


})



/////SHOP SINGLE
router.get('/shopsingle/:_id', (req, res) => {

  console.log(req.session, "session of chethwas pp");
  if (req.session.loggedin) {
    productController.getAllProductData().then((response2) => {
      productController.getProductData(req.params._id).then((response) => {
        res.render('user/shop-single', { response2, response, loggedin: true, user_header: true })
      })
    })
  } else {
    console.log(req.params._id, "sgfdfjhpl';lkjhgfdsadadf")
    productController.getAllProductData().then((response2) => {
      productController.getProductData(req.params._id).then((response) => {
        res.render('user/shop-single', { response2,response, user_header: true })
      })
    })

  }
})

////////////...................... C A R T ..........................//////////////


////ADD TO CART - GET
router.get('/showcart', (req, res) => {
  if (req.session.loggedin) {

    cartController.addProductDetails(req.session.user._id).then(async (productdetails) => {
      console.log(productdetails, 'product kee details');
      cartController.cartCount(req.session.user._id).then((cartscount) => {
        console.log(cartscount, 'cart keeeeeeeee count');
        cartController.getTotalAmount(req.session.user._id).then((totalamount) => {
          console.log(totalamount, "HFGFHG");
          if (cartscount == 0 || cartscount == undefined) {
            res.render('user/cart-empty', {
              loggedin: true,
              user_header: true
            })
          } else {
            res.render('user/addto-cart', {
              productdetails,
              cartscount,
              totalamount,
              loggedin: true,
              user_header: true

            })
          }

        })
      })
    })


  }else{
    res.redirect('/login')
  }
})

////ADD TO CART - POST
router.get('/addtocart/:_id', (req, res) => {
  if (req.session.loggedin) {
    console.log(req.session.user._id, 'adrarsgadsdfdhghjkjkljkljhklhjklhjkl-userid');
    cartController.addProductDetails(req.session.user._id).then(async (productdetails) => {
      console.log(productdetails, 'product---------details');
      cartController.addToCart(req.params._id, req.session.user._id).then(async (response) => {
        const deleteWishlist = await wishlistController.deleteItem(req.session.user._id, req.params._id)

        cart = response.cart
        cartEmpty = response.cartEmpty
        res.redirect('/showcart')
      })
    })


  } else {
    res.redirect('/login')
  }
})

////CART-INCREMENT


router.post('/changeCartQty', (req, res) => {
  console.log("reachedd");

  var data = {
    productid: req.body.id,
    userid: req.session.user._id,
    value: req.body.value,
  };
  cartController.changeCartQty(data, (err, taskData) => {
    if (err) {
      res.json({ msg: 'error' });
    } else {
      console.log(taskData, "vannu");
      res.json({ msg: 'success', data: taskData });
    }
  });
})

////CART-DELETE
router.get('/delete-cart/:_id', (req, res) => {
  if (req.session.loggedin) {
    console.log(req.session.user._id, req.params._id, 'delete carttttttttttttttttttttttttt');

    cartController.deleteCart(req.session.user._id, req.params._id).then((deleted) => {
      res.redirect('/showcart')
    })

  }
})

//////////....................... W I S H L I S T .......................///////////////


////WISHLIST-Get

router.get('/show-wishlist', (req, res) => {
  if (req.session.loggedin) {
    wishlistController.addItems(req.session.user._id).then((items) => {
      console.log(items, 'www-items');
      let wdata;
      if (!items.wishlistempty) {

        wdata = items.list.wishlistData;
      } else {
        wdata = []
      }
      console.log(wdata, 'wdata');
      wishlistController.itemCount(req.session.user._id).then((itemsCount) => {
        cartController.cartCount(req.session.user._id).then((cartCount) => {
          if (itemsCount == 0 || itemsCount == undefined) {
            res.render('user/wishlist-empty', {
              user_header: true,
              loggedin: true
            })
          } else {
            res.render('user/wish-list', {
              wdata,
              itemsCount,
              cartCount,
              user_header: true,
              loggedin: true
            })

          }

        })
      })
    })
  }else{
    res.redirect('/login')
  }
})

////WISHLIST-post
router.post("/wishlist", (req, res) => {
  wishlistController
    .addwishlist(req.session.user._id, req.body.id)
    .then((response) => {
      wishlistempty = response.wishlistempty;
      wishlist = response.wishlist;
      res.json([{
        id_recieved: req.body.id,
      }])
    });
});


////WISHLIST-delete
router.get('/delete-wishlist/:id', (req, res) => {
  console.log(req.params.id, "adarsh_zainiiiiiiiiiiiiiiiiiiiiiiiiiiii");
  if (req.session.loggedin) {
    wishlistController.deleteItem(req.session.user._id, req.params.id).then((response) => {
      res.redirect('/show-wishlist')
    })
  }
})

/////////////.....................C H E C K O U T..............................//////////

router.get('/checkout', (req, res) => {
  if (req.session.loggedin) {
    let userID = req.session.user._id
    cartController.addProductDetails(userID).then(async (productzdetails) => {
      req.session.cartdata = productzdetails

      req.session.coupen = false

      console.log(req.session.cartdata, 'productzzzzzzz_detailzzzzzzzzzzzz');
      cartController.getTotalAmount(userID).then((totalzamount) => {
        req.session.totalamount = totalzamount
        // console.log(totalzamount);
        cartController.cartCount(userID).then((cartCount) => {
          // console.log(cartzCount);
          wishlistController.itemCount(userID).then((itemsCount) => {
            // console.log(itemzcount);
            // cartController.getCoupon().then((couponz)=>{
            usercontroller.getUserData(userID).then((userzdata) => {
              addressController.getAddress(userID).then((addressdataa) => {
                console.log(addressdataa);
                res.render('user/check-out', {
                  user_header: true,
                  productzdetails,
                  totalzamount,
                  cartCount,
                  itemsCount,
                  userzdata,
                  addressdataa,
                  loggedin: true
                })
              })

            })
            // })
          })
        })
      })
    })
  }
})


router.post('/finalpayment', (req, res, next) => {
  if (req.session.loggedin) {
    userid = req.session.user._id
    console.log(userid);





    console.log(req.body, 'REQUEST BODY OF CHECKOUT .......................!!!!!!');
    console.log(req.session, 'REQUEST BODY OF SESSION .......................!!!!!!');
    console.log(req.session.cartdata.cart.cartdata, "cart ki daaata");


    try {
      const data = {
        userid: req.session.user._id,
        paymentMethod: req.body.paymentdetails,
        cartData: req.session.cartdata.cart.cartdata,
        cartTotal: req.session.totalamount,
        coupen: req.session.coupen,
        Final_total: req.body.total_prize,
        address: req.body.addressdetails,
      }

      console.log("dataaaaa", data);
      orderController.checkout(data, (response) => {
        console.log(response, "dad");
        total = response.finalCost
        console.log(total, "daddy");
        if (response.paymentMethod === "COD") {
          req.session.ordersuccess = true
          res.json({ CODStatus: true })
        } else {
          req.session.ordersuccess = true
          console.log(response._id, 'orderidD');
          console.log(response.finalCost, 'Final ki Cost');

          paymentController.generateRazorpay(response._id, response.finalCost).then((response) => {
            res.json(response)

          })

        }
      })

    }

    catch (err) {
      console.log(err, "error occured");

    }
  }

}

)

router.post('/verifypayment', (req, res) => {
  if (req.session.loggedin) {
    console.log(req.body, 'adarsh ki payment.........!!!!!!!!!!!!!!!!!!');
    res.redirect('/order-placed')
  }
})



/////....................................O R D E R  -  P L A C E M E N T....................................../////
router.get('/order-placed', (req, res) => {
  if (req.session.ordersuccess) {
    console.log(req?.params?.id, "req of the body order success");
    orderController.getOrderList(req.params.id).then((orderdata) => {
      console.log(orderdata, "order data to order confirmation page");
      res.render('user/order-placed', { user_header: true, loggedin: true, orderdata })
      req.session.ordersuccess = false;
    })
  }
})

//VIEW ORDERS
router.get('/vieworders', (req, res) => {
  if (req.session.loggedin) {
    orderController.getAllOrderList(req.session.user._id).then((orders) => {
      console.log(orders, "order data to order confirmation page");
      res.render('user/view-orders', { user_header: true, loggedin: true, layout: 'userprofile-header', orders })
    })
  }
})

router.get('/view-order-details/:id', (req, res) => {
  console.log(req.params.id, 'oder ki details on view details');
  if (req.session.loggedin) {
    orderController.getOrderList(req.params.id).then((orderdetails) => {
      cartController.addProductDetails(req.session.user._id).then(async (productzdetails) => {

        // req.session.cartdata = productzdetails
        console.log(productzdetails, "product of the cart");

        console.log(orderdetails, 'order detailssssssssssssssssssssss');
        res.render('user/order-details', { user_header: true, loggedin: true, layout: 'userprofile-header', productzdetails, orderdetails })
      })
    })

  }
})

////CANCEL ORDER
router.post('/cancelorder/:_id', (req, res) => {

  orderid = req.params._id

  orderController.cancelorder(orderid).then((cancelled) => {
    res.json({ cancelled })
  })
})

////////////..................... A D D R E S S ...............................////////// 

//ADDRESS-GET 
router.get('/add-address', (req, res) => {
  if (req.session.loggedin) {
    // cartController.cartCount(userid).then((cartcount) => {
    //   wishlistController.itemCount(userid).then((itemscount) => {
    res.render('user-profile/add-address', { user_header: true, loggedin: true, layout: 'userprofile-header' })
  }
})



//     })
//   }
// })

//ADDRESS-POST
router.post('/address', (req, res) => {
  if (req.session.user) {
    userid = req.session.user._id
    addressController.addAddress(req.body, userid).then((addressdata) => {
      res.redirect('/viewaddress')
    })
  }
})

////View-ADDRESS
router.get('/viewaddress', (req, res) => {
  if (req.session.user) {
    addressController.getAddress(req.session.user._id).then((response) => {
      console.log(response, 'shelooooooooooooooooooooooooofffffffffffffffffffffffffffffffffffffff');
      res.render('user-profile/view-address', { response, user_header: true, loggedin: true, layout: 'userprofile-header' })

    })
  }
})

////Delete address
router.get('/deleteaddress/:_id', (req, res) => {
  if (req.session.user) {
    addressController.deleteAddress(req.params._id).then(() => {
      res.redirect('/viewaddress')
    })
  }
})

////Update-Address
router.get('/updateaddress/:_id', (req, res) => {

  addressController.getAddressValue(req.params._id).then((response) => {
    console.log(response, 'asdfjhhhhhhhhhhhhhfgffffffffffdddddddddd');

    res.render('user-profile/edit-address', { response, user_header: true, loggedin: true, layout: 'userprofile-header' })
  })

})

router.post('/updateaddress/:_id', (req, res) => {

  console.log(req.params._id, 'adsfghjhsddffgggggggggggggggggggggggggghhhhhhhhhhhhhhhhhhhhhhhh');
  addressController.editAddress(req.body, req.params._id).then((response) => {
    res.redirect('/viewaddress')
  })

})

////.........................................U S E R - P R O F I L E..........................................////
router.get('/userprofile', (req, res) => {
  if (req.session.loggedin) {
    userdetails = req.session.user
    res.render('user-profile/user-profile', { user_header: true, userdetails, loggedin: true, layout: 'userprofile-header' })
  } else {
    res.redirect('/login')
  }
})

////......................ABOUT..................................////
router.get('/about',(req,res)=>{
  if(req.session.loggedin){
    res.render('user/about',{ loggedin: true,user_header: true})
  }else{
    res.render('user/about',{ user_header: true})
  }
  
})

/////............................................C O U P O N.........................................../////
router.post('/applyCoupon', (req, res) => {
  let userid = req.session.user._id
  console.log(req.body, 'coupon entered----------------------------------entered');
  console.log(userid, 'user id------------------------------------------users ID');
  couponController.applyCoupon(userid, req.body).then((appliedCoupon) => {
    console.log(appliedCoupon, 'applied Coupon.....................................5');

    if (appliedCoupon) {
      req.session.coupon = appliedCoupon

    }
    couponController.couponUser(userid, req.body).then((userZcoupon) => {
      couponController.getCoupon().then((couponz) => {
        res.json({ appliedCoupon })
      })
    })
  })
})

////////////////////////
router.post('/checkCoupen', async (req, res) => {




  try {
    if (req.session.coupen) {
      res.json({ msg: 'COuponalreadyused' });
    } else {

      console.log("ghfhg", req.body);
      ccode = req.body.value
      id = req.session.user._id;
      const data = await couponModel.find({ CouponCode: ccode }).lean()
      console.log('lalal', data);
      if (data.length != 0) {
        console.log("reach");
        var coupenExist = false;
        let coupen = await userModel.findOne({ _id: id }, { _id: 0, coupons: 1 }).lean()
        console.log(coupen, "aa", coupen.coupons[0]);
        for (let i = 0; i < coupen.coupons.length; i++) {
          if (String(coupen.coupons[i]) === String(data[0]._id)) {
            console.log("haha");
            coupenExist = true;
            break;
          }
        }
        if (coupenExist) {
          console.log('exist');
          res.json({ msg: 'coupenExist' });
        } else {
          console.log('true');
          req.session.coupen = data;
          console.log('kaak', req.session.coupen);
          res.json({ msg: 'success', data: data });
        }


      } else {
        console.log("coupen not found");
        res.json({ msg: 'coupennotfound' });
      }

    }

  }
  catch (err) {
    console.log("era");
  }


},

)











module.exports = router;
