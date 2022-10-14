const { resolveInclude } = require('ejs')
const { response } = require('express')
const bannerModel = require('../model/banner-model')

module.exports = {

    addBannerData: (bannerData) => {
        return new Promise(async (res, rej) => {
            const banner = await bannerModel.findOne({ banner_name: bannerData.banner_name }).lean()
            const response = {
                exist: false
            }
            if (!banner) {
                bannerModel.create(bannerData).then((Data) => {
                    response.exist = false
                    response.banner = bannerData
                    res(response)
                }).catch((err) => {
                    rej(err)
                })
            } else {
                response.exist = true
                response.banner = bannerData
                res(response)
            }
        })
    },

    getBannerAllData: () => {
        return new Promise(async (res, rej) => {
            const bannername = await bannerModel.find({}).lean()
            res(bannername)
        })



    },



    deleteBannerData: (bannerData) => {
        return new Promise(async (res, rej) => {
            const banner = await bannerModel.findByIdAndDelete(bannerData).lean()
            res(banner)
        })
    },



    updateBannerData: (bannerid,bannerData) => {
        return new Promise(async (res, rej) => {
            bannerModel.findByIdAndUpdate(bannerid, {
                banner_name: bannerData.banner_name,
                banner_discription: bannerData. banner_discription,
                

            }).then((response) => {
                res(response)
            })

        })
    },



    getBannerData: (bannerid) => {
        return new Promise((res, rej) => {
            bannerModel.findOne({ _id: bannerid }).lean().then((data) => {
                res(data)
            })
        })
    }


}





