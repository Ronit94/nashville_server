const UserDetailsServices = {},
    _ = require('lodash'),
    moment = require('moment'),
    config = require('../../../config/constants'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    Op = require('sequelize').Op;





UserDetailsServices.AddUserDetails = async (req, res, next) => {

    if (_.isNil(req.body.name)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Name is required"));
    }

    if (_.isNil(req.body.address)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"address is required"));
    }

    if(_.isNil(req.body.email)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Email is required"));
    }

    if (_.isNil(req.body.mobile)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Mobile is required"));
    }

    if (_.isNil(req.body.city)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"city is required"));
    }

    try {

        let findResult = await Models.userProfile.findOne(
            {
                where: {
                    userid : req.userdetails.userid
                }
            }
        )

        if (!_.isEmpty(findResult)) {
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'User details already exists'))
        }

        let result = await Models.userProfile.create({
            userid:req.userdetails.userid,
            name:req.body.name,
            address:req.body.address,
            email:req.body.email,
            mobile:req.body.mobile,
            city:req.body.city
        })

        return res.status(config.statuslist.default).send(config.responseObj(undefined,'User details created'))
    } catch (e) {
        return res.status(config.statuslist.exception).send(e,'Internal server error')
    }

}

UserDetailsServices.UpdateUserDetails = async(req,res,next)=>{
    let obj = {};

    if(!_.isNil(req.body.name)){
        obj['name'] = req.body.name
    }

    if(!_.isNil(req.body.address)){
        obj['address'] = req.body.address
    }

    if(!_.isNil(req.body.email)){
        obj['email'] = req.body.email
    }

    if(!_.isNil(req.body.mobile)){
        obj['mobile'] = req.body.mobile
    }

    if(!_.isNil(req.body.mobile)){
        obj['mobile'] = req.body.mobile
    }

    if(!_.isNil(req.body.city)){
        obj['city'] = req.body.city
    }

    try{
        let isUpdated = await Models.userProfile.update(obj,{
            where:{
                userid:req.userdetails.userid,
                id: req.userdetails.id
            }
        })

        if(isUpdated){
            return res.status(config.statuslist.default).send(config.responseObj(undefined,'User details updated'))
        }else{
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'User details not updated'))
        }


    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,'Internal error occured'))
    }
}



module.exports = UserDetailsServices