var express = require("express");
const session = require("express-session");
const { response } = require("../app");
var router = express.Router();
var adminController = require('../controllers/admincontroller');
const productController = require("../controllers/product-Controller");
const categoryController = require("../controllers/category-Controller");
const User = require('../model/usermodel')
const app = require("../app");
const couponController = require('../controllers/coupon-Controller')
const cartController = require('../controllers/cart-Controller')
const orderController = require('../controllers/order-Controller')


//...........MULTER............//
const multer = require('multer');
const bannerController = require("../controllers/banner-Controller");
const usercontroller = require("../controllers/usercontroller");
const filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/product')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload = multer({ storage: filestorageEngine })





/* DASHBOARD. */
router.get("/", function (req, res, next) {
  if (req.session.admin) {
    console.log("okokok");
    
   
      orderController.ordersAll().then((orderscount) => {
        orderController.ordersAll().then((allorders) => {
          usercontroller.allusers().then((userinfo) => {
            orderController.salestoday().then((ordertoday) => {
              console.log(ordertoday, 'ordertoday............!');
            console.log(userinfo, 'all of the users');
            console.log(allorders, "all of the orders");
            let todaysales = ordertoday.todaysale
            console.log(ordertoday, "ordertoday...........!!");
            let admin = req.session.admin;
            console.log(admin);

            res.render("admin/adminhome", { admin: true, layout: 'admin-layout', userinfo, allorders, todaysales, orderscount });
          })
        })
      })
    })
  } else {
    res.render("admin/adminlogin", { admin: false });
  }
});

router.get("/adminlogin", function (req, res) {
  if (req.session.admin) {
    res.redirect("/admin");
  } else {
    const admin = req.session.adminnotfound;
    let wrongpassword = req.session.wrongpassword;
    res.render("admin/adminlogin", { admin, wrongpassword });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect("/admin")
})

router.post("/login", (req, res, next) => {
  adminController.adminlogin(req.body).then((response) => {
    if (response.status) {
      req.session.admin = response.admin;
      console.log(req.session.admin);
      req.session.email = response.email;
      req.session.userloggedIn = true; //last added for middleware//
      console.log("login success");
      res.redirect('/admin')
      // res.render("admin/adminhome", { layout: 'admin-layout', admin_header: true });
    } else if (response.adminnotfound) {
      (req.session.adminnotfound = true),
        (req.session.wrongpassword = false),
        console.log("user not found");
      res.redirect("/admin");
    } else {
      (req.session.adminnotfound = false),
        (req.session.wrongpassword = true),
        res.redirect("/admin");
    }
  });
});

router.get("/table", function (req, res, next) {


  // let loggedin=req.session.loggedin
  User.find().lean().exec((error, data) => {
    res.render("admin/edit_user", { layout: 'admin-layout', user: data, admin_header: true });

  })


})

//..................block.........................////
router.get('/block-user/:id', (req, res) => {
  let id = req.params.id
  console.log("working");
  adminController.block_user(id).then((response) => {
    console.log(response);
    res.redirect('/admin/table')
  })
})
//...................active user....................//////

router.get('/active-user/:id', (req, res) => {
  let id = req.params.id
  console.log("active-working");
  adminController.active_user(id).then((response) => {
    console.log(response);
    res.redirect('/admin/table')
  })
})

//...........Category Management..................//

router.get('/category', (req, res) => {
  if (req.session.admin) {
    categoryController.getcategory().then((response) => {
      console.log(response);
      res.render('admin/list_category', { response, layout: 'admin-layout' })
    })
  } else {
    res.redirect('/admin')
  }
})

//.............Add Catagory Page GET..................//

router.get('/addcategory', (req, res) => {
  const categoryexist = req.session.categoryexist
  req.session.categoryexist = null

  res.render('admin/add-category', { categoryexist, layout: 'admin-layout' })
})

//..............Get Category Data....................//

router.post('/addcategory', (req, res) => {
  categoryController.addcategoryData(req.body).then((response) => {
    if (response.exist) {
      req.session.categoryexist = true
      req.session.category = response.category
      res.redirect('/admin/addcategory')
    } else {
      req.session.category = response.category
      console.log(req.session.category)
      console.log(response);
      res.redirect('/admin/category')
    }
  }).catch((err) => {
    console.log('error found', err);
  })
})

//.............Delete Catagory..............//

router.get('/delete-category/:_id', (req, res) => {
  const categoryid = req.params._id
  categoryController.deletecategory(categoryid).then((data) => {
    res.redirect('/admin/category')
  })
})

//...........Update Category.................//
router.get('/update-category/:id', (req, res) => {

  const categoryid = req.params.id
  const categoryexist = req.session.categoryexist
  categoryController.getcategorydata(categoryid).then((categorydata) => {
    res.render('admin/update-category', { categorydata, layout: 'admin-layout', categoryexist })
  })
})
router.post('/update-category/:id', (req, res) => {
  const categoryid = req.params.id
  categoryController.updatecategory(categoryid, req.body).then((response) => {
    console.log(response);
    res.redirect('/admin/category')
  })
})

//...........Product Management..................//

router.get('/productchart', (req, res) => {
  if (req.session.admin) {
    productController.getAllProductData().then((productlist) => {
      res.render('admin/list_product', { productlist: productlist, layout: 'admin-layout' })
    })
  } else {
    res.redirect('/admin')
  }
})

//.............Add Product.................//

router.get("/addproduct", (req, res) => {

  const productexist = req.session.productexist
  req.session.productexist = null
  categoryController.getcategory().then((category) => {
    console.log(category);
    res.render("admin/add-product", { admin: true, layout: 'admin-layout', category });

  })


})

//...........Post Product....................//
router.post('/addproduct', upload.array("image", 3), (req, res) => {
  const images = req.files
  let array = [];
  array = images.map((value) => value.filename)
  req.body.image = array
  productController.addProductData(req.body).then((response) => {
    console.log(req.body);

    if (response.exist) {
      req.session.productexist = true
      req.session.product = response.product

      res.redirect('/admin/productchart')
    } else {
      req.session.product = response.product

      res.redirect('/admin/productchart')
    }
  }).catch((err) => {
    console.log('error found', err);
  })
})

//.............Delete Product..............//

router.get('/delete-product/:id', (req, res) => {
  const productid = req.params.id
  productController.deleteProduct(productid).then((data) => {
    res.redirect('/admin/productchart')
  })
})


//...........Update ProductData.........//

router.get('/update-product/:id', async (req, res) => {
  const productid = req.params.id
  let category = await categoryController.getcategory()
  productController.getProductData(productid).then((response) => {
    res.render('admin/update-product', { layout: 'admin-layout', response, category })
  })
})




router.post('/update-product/:id', (req, res) => {
  const productid = req.params.id
  productController.updateproduct(productid, req.body).then((response) => {
    console.log(response, "updated product");
    res.redirect('/admin/productchart')
  })
})





//.....Banner LISTING.......//

router.get('/bannerlist', (req, res) => {
  bannerController.getBannerAllData().then((response) => {
    console.log(response);
    res.render('admin/list_banner', { admin: true, layout: 'admin-layout', response })
  })
})



//...........Add Banner.........//

router.get('/add-banner', (req, res) => {
  if (req.session.admin) {
    res.render("admin/add-banner", { admin: true, layout: 'admin-layout' });
  } else {
    res.redirect('/admin')
  }

})
//........Banner POST Method.....//
router.post('/add-banner', upload.array("banner_image", 3), (req, res) => {

  const images = req.files
  let array = []
  array = images.map((value) => value.filename)
  req.body.banner_image = array
  bannerController.addBannerData(req.body).then((response) => {
    console.log(req.body);
    if (response.exist) {
      req.session.bannerexist = true
      req.session.banner = response.bannerData
      res.redirect('/admin/add-banner')
    } else {
      req.session.banner = response.bannerData
      res.redirect('/admin/bannerlist')
    }
  })
})

//.......Banner DELETE.......//
router.get('/delete-banner/:id', (req, res) => {
  const bannerid = req.params.id
  bannerController.deleteBannerData(bannerid).then((data) => {
    res.redirect('/admin/bannerlist')
  })
})
//......Banner  UPDATE..........//
router.get('/update-banner/:id', (async (req, res) => {
  console.log("FHJHGJGJUKUYHKG");
  const bannerid = req.params.id
  await bannerController.getBannerData(bannerid).then((response) => {
    console.log(response, 'asdfjhhhhhhhhhhhhhfgffffffffffdddddddddd');

    res.render('admin/update-banner', { admin: true, layout: 'admin-layout', response })
  })

}))

router.post('/update-banner/:id', (req, res) => {
  const bannerid = req.params.id
  console.log(bannerid, 'adsfghjhsddffgggggggggggggggggggggggggghhhhhhhhhhhhhhhhhhhhhhhh');
  bannerController.updateBannerData(bannerid, req.body).then((response) => {
    res.redirect('/admin/bannerlist')
  })

})

////.............C O U P E N.................//
router.get('/addcoupon', (req, res) => {
  if (req.session.admin) {
    res.render('admin/add-coupon', { admin: true, layout: 'admin-layout' })
  }
})

router.post('/addcoupon', (req, res) => {
  if (req.session.admin) {
    console.log(req.body, 'The Coupon');
    couponController.addCoupon(req.body).then((coupon) => {

      res.redirect('/admin/couponlist')
    })
  }


})

////COUPON LISTING

router.get('/couponlist', (req, res) => {
  console.log("couponnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  couponController.getCoupon().then((response) => {
    console.log(response);
    res.render('admin/list_coupon', { admin: true, layout: 'admin-layout', response })
  })
})

////Delete COUPON
router.get('/delete-coupon/:id', (req, res) => {
  const couponid = req.params.id
  couponController.deleteCoupon(couponid).then((data) => {
    res.redirect('/admin/couponlist')
  })
})

////Update COUPON
router.get('/update-coupon/:id', (async (req, res) => {
  console.log("FHJHGJGJUKUYHKG");
  const couponid = req.params.id
  await couponController.getCouponValue(couponid).then((response) => {
    console.log(response, 'asdfjhhhhhhhhhhhhhfgffffffffffdddddddddd');

    res.render('admin/update-coupon', { admin: true, layout: 'admin-layout', response })
  })

}))

router.post('/update-coupon/:id', (async (req, res) => {
  console.log(req.params.id, "FHJHGJGJUKUYHKG");
  const couponid = req.params.id
  await couponController.updateCoupon(couponid, req.body).then((response) => {
    console.log(response, 'asdfjhhhhhhhhhhhhhfgffffffffffdddddddddd');

    res.redirect('/admin/couponlist')
  })

}))


////.............ORDER MANAGEMENT...................//

////Manage Order
router.get('/manageorder', (req, res) => {
  if (req.session.admin) {
    orderController.getAllOrderData().then((orders) => {
      console.log(orders, "orders of the admin");
      res.render('admin/manage-order', { admin: true, layout: 'admin-layout', orders })
    })
  }


})

router.post('/shiporder/:_id', (req, res) => {

  orderid = req.params._id
  console.log(orderid, 'shiporder id.................l..l.l.l');

  orderController.shiporder(orderid).then((shipped) => {
    res.json({ shipped })
  })
})


router.post('/delivered/:_id', (req, res) => {

  orderid = req.params._id
  console.log(orderid, 'deliveredd id.................l..l.l.l');

  orderController.delivered(orderid).then((shipped) => {
    res.json({ shipped })
  })
})

////CANCEL ORDER
router.post('/cancelorder/:_id', (req, res) => {

  orderid = req.params._id

  orderController.cancelorder(orderid).then((cancelled) => {
    res.json({ cancelled })
  })
})





module.exports = router;
