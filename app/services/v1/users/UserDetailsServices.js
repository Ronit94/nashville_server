const UserDetailsControllers = {},
    _ = require('lodash'),
    moment = require('moment'),
    config = require('../../../config/constants'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    Op = require('sequelize').Op;





UserDetailsControllers.AddUserDetails = async (req, res, next) => {

    if (_.isNil(req.body.Gender)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Gender is required"));
    }

    if (_.isNil(req.body.Age)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Age is required"));
    }

    if(_.isNil(req.body.Phone_no)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Phone number is required"));
    }

    if (_.isNil(req.body.Citizenship)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Cityzenship is required"));
    }

    if (_.isNil(req.body.Address)) {
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,"Address is required"));
    }

    try {

        let findResult = await Models.UserDetailsSchema.findOne(
            {
                where: {
                    User_ID : req.body.email
                }
            }
        )

        console.log(findResult)

        if (!_.isEmpty(findResult)) {
            return res.status(config.statuslist.unprocessEntity).send(config.responseObj(undefined,'User details already exists'))
        }

        let result = await Models.UserDetailsSchema.create({
            User_ID:req.userdetails.User_ID,
            Gender:req.body.Gender,
            Age:req.body.Age,
            Phone_no:req.body.Phone_no,
            Citizenship:req.body.Citizenship,
            Address:req.body.Address
        })

        return res.status(config.statuslist.default).send(config.responseObj(undefined,'User details created'))
    } catch (e) {
        return res.status(config.statuslist.exception).send(e,'Internal server error')
    }

}



module.exports = UserDetailsControllers