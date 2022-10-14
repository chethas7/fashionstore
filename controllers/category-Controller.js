const { response } = require("../app");
const categoryModel = require("../model/category-model")

module.exports={

    addcategoryData: (categorydata)=>{
        
        return new Promise(async (resolve,reject)=>{
            const category = await categoryModel.findOne({categoryname: categorydata.categoryname}).lean();
            const response = {
                exist:false
            }
            if(!category){
                categoryModel.create(categorydata).then((data)=>{
                    response.exist = false
                    response.category = categorydata
                    resolve(response)
                }).catch((err)=>{
                    console.log('error creating',err)
                    resolve(err)
                })
            }else{
                response.exist = true
                response.category = categorydata
                resolve(response)

            }
        })
    },

    getcategory: ()=>{
        return new Promise(async(resolve,reject)=>{

            const categoryname = await categoryModel.find({}).lean()
            resolve(categoryname)

        })
    },

    getcategorybyID: (categoryid)=>{
        return new Promise(async(resolve,reject)=>{

            const categoryname = await categoryModel.findById(categoryid).lean()
            console.log(categoryname,"category-name");
            resolve(categoryname)

        })
    },

    deletecategory: (categoryid)=>{
        return new Promise(async(resolve,reject)=>{
            const category = await categoryModel.findByIdAndDelete({_id:categoryid}).lean();

            resolve(resolve)
        })
    },

        getcategorydata: (categoryid)=>{
        return new Promise(async(resolve,reject)=>{
            const category = await categoryModel.find({_id:categoryid}).lean();

            resolve(category)
        })
    },

        updatecategory: (categoryid,categoryDetails)=>{
        return new Promise((resolve,reject)=>{
            categoryModel.findByIdAndUpdate(categoryid,{categoryname:categoryDetails.categoryname}).then((response)=>{
                resolve(response)
            })
        })
    }
      



    }

