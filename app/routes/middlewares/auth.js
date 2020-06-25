const Models = require('../../db/models/Relational/index'),
    commonFunction = require('../../core/commonFunctions'),
    constants = require('../../config/constants'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    AuthControllers = {};


AuthControllers.createAuthToken = (userdata) => {
    return new Promise((resolve, reject) => {
        jwt.sign(userdata, constants.jwt.secret, constants.jwt.options, (err, token) => {
            if (err) {
                reject();
            } else {
                resolve(token);
            }
        })
    })
}

AuthControllers.verifyAdminToken = (req, res, next) => {
    
    var token = req.headers.authToken || req.headers['access-token'] || req.headers.authorization || req.body.accessToken
    if (!token) {
        return res.status(constants.statuslist.notFound).send(constants.responseObj(undefined,'Token required'))
    }

    if (token.startsWith("Bearer ")){
        token = token.substring(7, token.length);
   } else {
      return res.status(constants.statuslist.exception).send(constants.responseObj(undefined,'Token extraction failed'));
   }

    jwt.verify(token, constants.jwt.secret, (error, decoded) => {
        if (error instanceof Error) {
            if (error.name == 'TokenExpiredError') {
                return res.status(constants.statuslist.unprocessEntity).send(constants.responseObj(error,'Token expired'))
            } else {
                return res.status(constants.statuslist.exception).send(constants.responseObj(error,'Internal server error'))
            }
        } else {
            Models.admins.findOne({
                where: {
                    id : decoded.id,
                    adminid: decoded.adminid
                }
            })
                .then((user) => {
                    user = user.get({ plain: true })
                    if (_.isEmpty(user)) {
                        return res.status(constants.statuslist.notFound).send(constants.responseObj(undefined,'Admin is not present'))
                    } else {
                        user=_.omit(user,['Password'])
                        req.userdetails = user
                        next()
                    }
                })
                .catch((error) => {
                    return res.status(constants.statuslist.exception).send(constants.responseObj(undefined,'Internal server error'))
                })
        }
    })
}

AuthControllers.verifyUserToken = (req, res, next) => {
    var token = req.headers.authToken || req.headers['access-token'] || req.headers.authorization || req.body.accessToken
    if (!token) {
        return res.status(constants.statuslist.notFound).send(constants.responseObj(undefined,'Token required'))
    }

    if (token.startsWith("Bearer ")){
        token = token.substring(7, token.length);
    } else {
        return res.status(constants.statuslist.exception).send(constants.responseObj(undefined,'Token extraction failed'));
    }

    jwt.verify(token, constants.jwt.secret, (error, decoded) => {
        if (error instanceof Error) {
            if (error.name == 'TokenExpiredError') {
                return res.status(constants.statuslist.unprocessEntity).send(constants.responseObj(error,'Token expired'))
            } else {
                return res.status(constants.statuslist.exception).send(constants.responseObj(error,'Internal server error'))
            }
        } else {
            Models.users.findOne({
                where: {
                    id : decoded.id,
                    userid: decoded.userid
                }
            })
                .then((user) => {
                    user = user.get({ plain: true })
                    if (_.isEmpty(user)) {
                        return res.status(constants.statuslist.notFound).send(constants.responseObj(undefined,'Admin is not present'))
                    } else {
                        user=_.omit(user,['Password'])
                        req.userdetails = user
                        next()
                    }
                })
                .catch((error) => {
                    return res.status(constants.statuslist.exception).send(constants.responseObj(undefined,'Internal server error'))
                })
        }
    })
}

module.exports = AuthControllers





