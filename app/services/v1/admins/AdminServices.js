const AdminServices = {},
    _ = require('lodash'),
    moment = require('moment'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    config = require('../../../config/constants'),
    mailFunction = require('../../../core/mailFunction'),
    Op = require('sequelize').Op;



AdminServices.AddAdmin = async (req,res,next)=>{
    if(_.isNil(req.body.name)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Name is required'))
    }

    if(_.isNil(req.body.email)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Email is required'))
    }

    if(_.isNil(req.body.mobile)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Mobile is required'))
    }

    if(_.isNil(req.body.Password)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Password is required'))
    }

    req.body.resetPin = req.body.resetPin ? req.body.resetPin : null

    try{
        let hash = await commonFunction.createHashPassword(req.body.Password)

        let check = await Models.admins.findOne(
            {
                where: {
                    [Op.and]: [
                        {
                            adminid: req.body.email
                        }, {
                            mobile : req.body.mobile
                        }
                    ]
                }
            }
        )

        if(!_.isEmpty(check)){
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,"Admin already exists"))
        }


        let isCreated = await Models.admins.create({
            adminid: req.body.email,
            name: req.body.name,
            Password : hash,
            email: req.body.email,
            mobile : req.body.mobile,
            resetPin : req.body.resetPin
        })

        if(isCreated){
            return res.status(config.statuslist.default).send(config.responseObj(undefined,'Admin created'))
        }

    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,'Internal server error'))
    }

}


AdminServices.AdminLogin = async (req,res,next) =>{

    if(_.isNil(req.body.email) || _.isNil(req.body.mobile)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Username is required"))
    }

    if(_.isNil(req.body.Password)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Password is required"))
    }

    try{
        let admin = await Models.admins.findOne(
            {
                where: {
                    [Op.or]: [
                        {
                            adminid: req.body.email
                        }, {
                            mobile : req.body.mobile
                        }
                    ]
                }
            }
        )

        admin = admin.get({plain: true})

        if(_.isEmpty(admin)){
            return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Admin not exists"))
        }

        let isPasswordmatch = await commonFunction.checkPassword(req.body.Password,admin.Password)

        if(isPasswordmatch){
            let dataToEncrypt = { ...{ id: admin.id, adminid: admin.adminid } }
            admin = _.omit(admin, ['íd','Password', 'adminid', 'createdAt', 'updatedAt']);
            admin.token = await auth.createAuthToken(dataToEncrypt);
            await Models.admins.update({
                loggedin:1 
            },{
                where:{
                    [Op.or]: [
                        {
                            adminid: req.body.email
                        }, {
                            mobile : req.body.mobile
                        }
                    ]
                }
            })
            return res.status(config.statuslist.default).send(config.responseObj(admin,'User logged in'))
        }else{
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'Password is wrong'))
        }
    }catch(error){
        console.log(error)
        return res.status(config.statuslist.exception).send(config.responseObj(error,"Internal server error"))
    }
}

AdminServices.UpdateAdmin = async(req,res,next) =>{
    let obj = {};

    if(!_.isNil(req.body.name)){
        obj['name'] = req.body.name
    }

    if(!_.isNil(req.body.email)){
        obj['email'] = obj['adminid'] = req.body.email
    }

    if(!_.isNil(req.body.Password)){
        obj['Password'] = commonFunction.createHashPassword(req.body.Password)
    }

    if(!_.isNil(req.body.mobile)){
        obj['mobile'] = req.body.mobile
    }

    if(!_.isNil(req.body.resetPin)){
        obj['resetPin'] = req.body.resetPin
    }

    try{

        let isUpdate = await Models.admins.update(obj,{
            where:{
                [Op.or]: [
                    {
                        adminid: req.userdetails.adminid
                    }, {
                        mobile : req.userdetails.mobile
                    }
                ]
            }
        })

        if(isUpdate){
            return res.status(config.statuslist.default).send(config.responseObj(undefined,"Admin data updated"))
        }else{
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,"Admin data is not updated"))
        }
    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,"Internal server error"))
    }

}

module.exports = AdminServices