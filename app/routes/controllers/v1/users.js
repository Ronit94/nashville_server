const router = require('express').Router(),
    AuthController=require('../../middlewares/auth'),
    UserServices = require('../../../services/v1/users/UserServices'),
    UserDetailsServices = require('../../../services/v1/users/UserDetailsServices');

/**
 * @author Ronnie Sarma
 * @description Router Configuration starts from here
 */

router.route('/registration').post(UserServices.UserRegistration);
router.route('/login').post(UserServices.UserLogin);
router.route('/forgot-password').post(UserServices.ForgotPassword);

router.post('/user-details/create',AuthController.verifyUserToken,UserDetailsServices.AddUserDetails);
router.route('/user-details/update').patch(AuthController.verifyUserToken,UserDetailsServices.UpdateUserDetails)
router.route('/user/delete').delete(AuthController.verifyAdminToken,UserServices.DeleteUser)

module.exports = router