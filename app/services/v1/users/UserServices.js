const UserServices = {},
    _ = require('lodash'),
    moment = require('moment'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    config = require('../../../config/constants'),
    mailFunction = require('../../../core/mailFunction'),
    Op = require('sequelize').Op;





UserServices.UserRegistration = async (req, res, next) => {


    if (_.isNil(req.body.username)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Email is required'))
    }

    if (_.isNil(req.body.Password)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Password is required'))
    }

    try {
        let password = await commonFunction.createHashPassword(req.body.Password);


        let findResult = await Models.users.findOne(
            {
                where: {
                    userid: req.body.username
                }
            }
        )

        console.log('data',findResult)

        if (!_.isEmpty(findResult)) {
            return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'User exists'));
        }

        let result = await Models.users.create({
            userid: req.body.username,
            username: req.body.username,
            Password: password,
            resetPin:req.body.resetPin ? req.body.resetPin : null,
            isActive: 1,
            last_login: moment()
        })
        return res.status(config.statuslist.default).send(config.responseObj('User added successfully'))
    } catch (e) {
        console.log('error',e)
        return res.status(config.statuslist.exception).send(config.responseObj(e,'Internal server error'))
    }

}

UserServices.UserLogin = async (req, res, next) => {
    if (_.isNil(req.body.username)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Username is required'))
    }

    if (_.isNil(req.body.Password)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Password is required'))
    }

    try {
        let User = await Models.users.findOne({
            where: {
                userid: req.body.username
            },
            include:[{model: Models.userProfile, required:false,attributes: ['name','address','email','mobile','city']}]
        })

        User = User.get({plain: true})

        if (_.isEmpty(User)) {
            return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'User not exists'))
        }


        let isChecked = await commonFunction.checkPassword(req.body.Password, User.Password);


        if (isChecked) {
            let dataToEncrypt = { ...{ id: User.id, userid: User.userid } }

            User = _.omit(User, ['id','Password', 'userid', 'isActive','resetPin','last_login', 'createdAt', 'updatedAt']);


            User.token = await auth.createAuthToken(dataToEncrypt);
            return res.status(config.statuslist.default).send(config.responseObj(User,'User logged in'))
        } else {
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'Password is wrong'))
        }
    } catch (e) {
        return res.status(config.statuslist.exception).send(config.responseObj(e,'Internal error occured'))
    }
}


UserServices.AdminMobileLogin = async (req, res, next) => {
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

UserServices.ForgotPassword = async (req,res,next) =>{
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

UserServices.DeleteUser = async(req,res,next) =>{
    Promise.all([
        Models.users.delete({
            where:{
                userid : req.body.userid
            }
        }),
        Models.userProfile.delete({
            where:{
                userid : req.body.userid
            }
        })
    ])
    .then(isdelete =>{
        if(isdelete){
            return res.status(config.statuslist.default).send(config.responseObj(undefined,'User data is deleted'))
        }
    }).catch((error)=>{
        return res.status(config.statuslist.exception).send(config.responseObj(undefined,'Internal server occured'))
    })
}


module.exports = UserServices