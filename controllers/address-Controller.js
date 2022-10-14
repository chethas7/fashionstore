const addressModel = require('../model/address-model')

const categoryController = require('../controllers/category-Controller')
const productController = require('../controllers/product-Controller');
const async = require('hbs/lib/async');
const { promise } = require('bcrypt/promises');
const { Promise } = require('mongoose');
const { response } = require('../app');

module.exports = {
    addAddress: (addressdata, userid) => {
        console.log(userid, 'useriDDDDDDDDDDDD');
        return new Promise(async (res, rej) => {
            const address = new addressModel({
                Name: addressdata.name,
                LastName: addressdata.lastname,
                Number: addressdata.number,
                Pincode: addressdata.pincode,
                Locality: addressdata.locality,
                Address: addressdata.address,
                State: addressdata.state,
                LandMark: addressdata.landmark,
                Housename: addressdata.housename,
                userId: userid
            })
            address.save().then((address) => {
                res(address)
                console.log(address);
            })
        })
    },

    getAddress: (userid) => {
        return new Promise(async (res, rej) => {
            const useraddress = await addressModel.find({ userId: userid }).lean()
            res(useraddress)
        })
    },

    getAddressValue: (addressid) => {
        return new Promise(async (res, rej) => {
            let usersaddress = await addressModel.findOne({ _id: addressid }).lean()
            res(usersaddress)
        })
    },

    editAddress: (userdata, addressid) => {
        return new Promise(async (res, rej) => {
            await addressModel.findByIdAndUpdate(addressid, {
                Name: userdata.name,
                LastName: userdata.lastname,
                Number: userdata.number,
                Pincode: userdata.pincode,
                Locality: userdata.locality,
                Address: userdata.address,
                State: userdata.state,
                LandMark: userdata.landmark,
                Housename: userdata.housename
            }).then((response) => {
                res(response)
            })
        
        })

    },
    deleteAddress: (addressid) => {
        return new Promise(async (res, rej) => {
            addressModel.findByIdAndDelete({ _id: addressid }).then((response) => {
                res(response)
            })
        })
    }
}