const UsersControllers = {},
    _ = require('lodash'),
    moment = require('moment'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    config = require('../../../config/constants'),
    mailFunction = require('../../../core/mailFunction'),
    Op = require('sequelize').Op;





UsersControllers.UserRegistration = async (req, res, next) => {


    if (_.isNil(req.body.email)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Email is required'))
    }

    if (_.isNil(req.body.Full_name)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Name is required'))
    }

    if (_.isNil(req.body.password)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Password is required'))
    }

    if(_.isNil(req.body.city)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'City is required'))
    }

    if(_.isNil(req.body.state)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'State is required'))
    }

    req.body.ProfilePicture = _.isNil(req.body.ProfilePicture) ? '' : req.body.ProfilePicture

    let cityCode = await commonFunction.createCityCode(req.body.city, req.body.state)

    try {
        let password = await commonFunction.createHashPassword(req.body.password);


        let findResult = await Models.UserSchema.findOne(
            {
                where: {
                    [Op.and]: [
                        {
                            User_ID: req.body.email
                        }, {
                            City_code : cityCode
                        }
                    ]
                }
            }
        )

        if (!_.isEmpty(findResult)) {
            return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'User exists'));
        }

        let result = await Models.UserSchema.create({
            User_ID: req.body.email,
            Full_name: req.body.Full_name,
            Password: password,
            City_code:cityCode,
            ProfilePicture: req.body.ProfilePicture
        })
        return res.status(config.statuslist.default).send(config.responseObj('User added successfully'))
    } catch (e) {
        console.log(e)
        return res.status(config.statuslist.exception).send(config.responseObj(e,'Internal server error'))
    }

}

UsersControllers.UserLogin = async (req, res, next) => {
    if (_.isNil(req.body.email)) {
        return res.status(404).send({
            responseText: 'Admin Email is required'
        })
    }

    if (_.isNil(req.body.password)) {
        return res.status(404).send({
            responseText: 'Admin Password is required'
        })
    }

    //let College_ID = await commonFunction.createCollegeID(req.body.College_Name, req.body.College_state)
    try {
        let User = await Models.UserSchema.findOne({
            where: {
                User_ID: req.body.email
            },
            include:[{model: Models.UserDetailsSchema, required:false}]
        })

        User = User.get({plain: true})

        if (_.isEmpty(User)) {
            return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'User not exists'))
        }


        let isChecked = await commonFunction.checkPassword(req.body.password, User.Password);


        if (isChecked) {
            let dataToEncrypt = { ...{ City_code: User.City_code, User_ID: User.User_ID } }

            User = _.omit(User, ['Password', 'User_ID', 'City_code', 'createdAt', 'updatedAt']);


            User.token = await auth.createAuthToken(dataToEncrypt);
            return res.status(config.statuslist.default).send(config.responseObj(User,'User logged in'))
        } else {
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'Password is wrong'))
        }
    } catch (e) {
        return res.status(config.statuslist.exception).send(config.responseObj(e,'Internal error occured'))
    }
}


UsersControllers.AdminMobileLogin = async (req, res, next) => {
    if (_.isNil(req.body.MobileNo)) {
        return res.status(404).send({
            responseText: 'Mobile no is required'
        })
    }

    if (_.isNil(req.body.OTP)) {
        return res.status(404).send({
            responseText: 'OTP is required'
        })
    }

    let currentTime = moment()
    try {
        let FindOTp = Models.otpSchema.findOne({
            where: {
                Mobile: req.body.MobileNo,
                OTP: req.body.OTP
            }
        })

        if (_.isEmpty(FindOTp)) {
            return res.status(401).send({
                responseText: 'OTP is not present'
            })
        } else {
            let minsDiff = currentTime.diff(FindOTp.createdAt, 'minutes')
            if (minsDiff >= 5) {
                let isDeleted = await Models.otpSchema.destroy({
                    where: {
                        Mobile: req.body.MobileNo,
                        OTP: req.body.OTP
                    }
                })
                return res.status(401).send({
                    responseText: 'OTP expired,please do the process again'
                })
            } else {
                let isDeleted = await Models.otpSchema.destroy({
                    where: {
                        Mobile: req.body.MobileNo,
                        OTP: req.body.OTP
                    }
                })
                return res.status(200).send({
                    responseText: 'Admin logged in successfully'
                })
            }
        }
    } catch (e) {
        return res.status(500).send({
            responseText: 'Internal error occured'
        })
    }
}

UsersControllers.ForgotPassword = async (req,res,next) =>{
    if(_.isNil(req.body.email)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Email is required'))
    }

    let User = Models.UserSchema.findOne({
        where:{
            User_ID : req.body.email
        }
    })

    User = User.get({plain:true})

    if(_.isEmpty(User)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'User is not present'))
    }

    let password = commonFunction.generatePassword();
    try{
        let hash = await commonFunction.createHashPassword(password);
        let isUpdate = await Models.UserSchema.update({
            Password : hash
        },{
            where:{
                User_ID : req.body.email
            }
        })

        let [subject,text] = [`Password Update`,`Your updated Password ${password}`]

        if(isUpdate){
            let send = await mailFunction(config.mailConfig.from,req.body.email,subject,text);
            if(send instanceof Error){
                return res.status(config.statuslist.exception).send(config.responseObj(undefined,'Mail send error'))
            }else{
                return res.status(config.statuslist.default).send(config.responseObj(undefined,'An Email is sent to your register email id'))
            }
        }else{
            return res.status(config.statuslist.exception).send(config.responseObj(undefined,'Update error'))
        }
    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,'Internal server error'))
    }



}

module.exports = UsersControllers