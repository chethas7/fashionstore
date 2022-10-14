const userModel = require('../model/usermodel')
const bcrypt = require('bcrypt')

module.exports = {
    userlogin: (logindata) => {

        return new Promise(async (resolve, reject) => {
            let response = {
                status: false,
                usernotfound: false
            }
            let user = await userModel.findOne({ email: logindata.email })
            console.log('emai')
            console.log(user);
            if (user) {
                bcrypt.compare(logindata.password, user.password, (err, valid) => {

                    if (valid) {
                        response.status = true
                        response.user = user
                        response.email = user.email
                        console.log(response.email)
                        resolve(response)
                        console.log('success')
                    } else {
                        response.usernotfound = true
                        response.status = false
                        resolve(response);
                        console.log('error bcrypting', err)
                    }
                })
            } else {
                response.usernotfound = true
                console.log('failed');
                response.status = false
                resolve(response)
            }
        })
    },
    getUserData: (userid) => {
        console.log(userid, ';this is productid')
        return new Promise((res, rej) => {
            userModel.findOne({ _id: userid }).lean().then((data) => {
                console.log(data, 'this is data');
                res(data)
            })
        })


    },

    getAllUserData: () => {
        return new Promise((res, rej) => {
            userModel.find().lean().then((data) => {
                console.log(data, 'this is data');
                res(data)
            })
        })
    },

    allusers:()=>{
        return new Promise((resolve,reject)=>{
            try{
                let response = {}
                 userModel.find().lean().then((users)=>{
                    let totaluser = users.length;
                    userModel.find({status:true}).lean().then((blocked)=>{
                        blockeduser = blocked.length
                        userModel.find({status:false}).lean().then((active)=>{
                            activeuser = active.length
                            response.totalusers = totaluser;
                            response.activeusers = activeuser
                            response.blockedusers = blockeduser
                            resolve(response)
                        })
                    })
                })

            }
            catch(error){
                reject(error)

                
            }
        })
    }
}