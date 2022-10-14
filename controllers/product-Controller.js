
const { response } = require("../app")
const productModel = require("../model/product-model")

module.exports = {

    addProductData: (productdata) => {
    console.log(productdata);
    return new Promise(async (resolve, reject) => {
      const product = await productModel.findOne({ product_name: productdata.product_name }).lean();
      const response = {
        exist: false
      }
      if (!product) {
        productModel.create(productdata).then((data) => {
          response.exist = false
          response.product = productdata
          resolve(response)

        }).catch((err) => {
          resolve(err)
        })
      } else {
        response.exist = true
        response.product = productdata
        resolve(response)
      }
    })



  },

  getAllProductData: () => {
    return new Promise(async (resolve, reject) => {
      const product = await productModel.find().populate('product_category').lean();
      resolve(product)
    })

  },

  getProductData: (productid) => {
    console.log(productid,';this is productid')
    return new Promise((res, rej) => {
      productModel.findOne( {_id:productid} ).populate('product_category').lean().then((data) => {
        console.log(data,'this is data');
        res(data)
      })
    })

  },

  getCAtegoryData: (productid) => {
    console.log(productid,'this is productid')
    return new Promise((res, rej) => {
      productModel.find( {product_category:productid} ).populate('product_category').lean().then((data) => {
        console.log(data,'this is data');
        res(data)
      })
    })

  },

  deleteProduct: (productid) => {
    return new Promise(async (resolve, reject) => {
      await productModel.findByIdAndDelete({ _id: productid }).lean();

      resolve(resolve)
    })
  },

  updateproduct: (productid, productDetails) => {
    console.log(productid,'idddddddddddddddddddddddddd');
    console.log(productDetails,'details')
    return new Promise(async (resolve, reject) => {

      productModel.findByIdAndUpdate(productid, {
        product_name: productDetails.product_name,
        product_discription:productDetails.product_discription,
        product_price: productDetails.product_price,
        product_discount: productDetails.product_discount, 
        product_category: productDetails.product_category,
        stock_availability: productDetails.stock_availability,
        image: productDetails.image
      }).then((response) => {
        resolve(response)
      })





    })
  }
}

