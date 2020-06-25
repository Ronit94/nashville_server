const router = require('express').Router(),
    AuthController=require('../../middlewares/auth'),
    UserServices = require('../../../services/v1/users/UserServices');

/**
 * @author Ronnie Sarma
 * @description Router Configuration starts from here
 */

router.route('/registration').post(UserServices.UserRegistration);
router.route('/login').post(UserServices.UserLogin);
router.route('/forgot-password').post(UserServices.ForgotPassword);


//router.post('/user-details',AuthController.verifyUserToken,UserDetailsControllers.AddUserDetails);



module.exports = router