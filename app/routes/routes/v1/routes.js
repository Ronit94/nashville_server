const express = require('express');
const Router = express.Router();


module.exports = (app) => {
    console.log(`Initializing Nashvile backend server`);
    app.use('/api/user', require('../../controllers/v1/users'));
    app.use('/api/admin',require('../../controllers/v1/admins'));
    //app.use('/api/adds',require('../../controllers/v1/adds'));
    //app.use('/api/core',require('../../controllers/v1/core'));
}
