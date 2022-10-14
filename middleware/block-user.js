const userModel = require('../model/usermodel');


module.exports = {
    isblocked: (req, res, next) => {
        if (req.session.user) {
            new Promise(async (resolve, reject) => {
                let user = await userModel.findOne({ email: req.session.email })
                resolve(user)
            }).then((user) => {
                if (user.status) {
                    res.sendStatus(404)
                }
                else {
                    next()


                }
            })
        } else {
            next()


        }



    },

}