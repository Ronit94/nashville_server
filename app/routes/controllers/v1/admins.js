const router = require('express').Router(),
     AuthServices = require('../../middlewares/auth'),
     AdminServices= require('../../../services/v1/admins/AdminServices');



router.route('/add').post(AdminServices.AddAdmin);
router.route('/login').post(AdminServices.AdminLogin);
router.route('/update').patch(AuthServices.verifyAdminToken,AdminServices.UpdateAdmin)


module.exports = router