const adminModel = require('../model/adminmodel')
const bcrypt = require('bcrypt')
const userModel = require('../model/usermodel')

module.exports = {
    adminlogin: (adminlogindata) => {

        return new Promise(async (resolve,reject) => {
            let response = {
                status: false,
                adminnotfound: false
            }
            let admin = await adminModel.findOne({email: adminlogindata.email})
            console.log('email')
            if(admin) {  
                bcrypt.compare(adminlogindata.password, admin.password, (err,valid) => {
                   
                    if(valid) {
                        response.status = true
                        response.admin = admin
                        response.email = admin.email
                        console.log(response.email)
                        resolve(response)
                        console.log('success')
                    }else{
                        response.adminnotfound=true
                        resolve(response);
                        console.log('error bcrypting',err)
                    }
                })
            }else{
                response.adminnotfound = true
                console.log('failed');
                resolve(response)
            }
        })
    },



//...................... Block User........................//



block_user: (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await userModel.findById({ _id: Object(id) })
        user.status = true
        await userModel.updateOne({ _id: Object(id) }, user)
        resolve('got it')
    })

},

active_user: (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await userModel.findById({ _id: Object(id) })
        user.status = false
        await userModel.updateOne({ _id: Object(id) }, user)
        resolve('its done')

    })

}
}