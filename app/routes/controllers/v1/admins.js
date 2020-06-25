const router = require('express').Router(),
     AdminServices= require('../../../services/v1/admins/AdminServices');



router.route('/add').post(AdminServices.AddAdmin);
router.route('/login').post(AdminServices.AdminLogin);



module.exports = router