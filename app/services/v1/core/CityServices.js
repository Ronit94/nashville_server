const CityControllers = {},
    _ = require('lodash'),
    moment = require('moment'),
    Models = require('../../../db/models/Relational/index'),
    commonFunction = require('../../../core/commonFunctions'),
    auth = require('../../../routes/middlewares/auth'),
    config = require('../../../config/constants'),
    Op = require('sequelize').Op;



CityControllers.AddCityData = async (req, res, next) => {
    if(_.isNil(req.body.name)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Name is required'))
    }

    if(_.isNil(req.body.state)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'State is required'))
    }

    if(_.isNil(req.body.address)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Address is required'))
    }

    if(_.isNil(req.body.lat)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Latitude is required'))
    }

    if(_.isNil(req.body.long)){
        return res.status(config.statuslist.notFound).send(config.responseObj(undefined,'Longitude is required'))
    }

    try{
        let cityCode = await commonFunction.createCityCode(req.body.name,req.body.state) 
        let city = Models.CitySchema.build({
            City_code:cityCode,
            name:req.body.name,
            state:req.body.state,
            address:req.body.address,
            lat:req.body.lat,
            Long:req.body.long
        })

        let response = await city.save()

        if(response){
            return res.status(config.statuslist.default).send(config.responseObj(undefined,'City data added'))
        }

    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,'Exception occured'))
    }


}



CityControllers.FetchCityeData = async (req, res, next) => {
    try{
        let cities = await Models.CitySchema.findAll();
        return res.status(config.statuslist.default).send(config.responseObj(cities,'City Data fetched'))
    }catch(error){
        return res.status(config.statuslist.exception).send(config.responseObj(error,'Exception occured'))
    }
}


module.exports = CityControllers