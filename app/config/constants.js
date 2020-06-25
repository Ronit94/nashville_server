

require('dotenv').config();
const _ = require('lodash');

module.exports = {
    allowMimeType: ['image/jpeg', 'image/png', 'application/pdf'],
    jwt: {
        secret: process.env.jwtSecret,
        options: {
            algorithm: 'HS512',
            expiresIn: 60 * 60,
            audience: 'aud:AlienceHoodServer',
            issuer: 'AlienceHoodServer-' + process.env.GIT_BRANCH + '-' + (process.env.NODE_ENV == 'development' ? 'DEV' : 'PROD') + '@' + require('os').hostname()
        }
    },
    uploads: {
        TempSemesterResultFolder: global.appPath + '/uploads/TempSemsterResult',
        TempSemesterFeesFolder: global.appPath + '/uploads/TempSemesterFeesFolder',
        TempAdminProfileFolder: global.appPath + '/uploads/TempAdminProfileFolder'
    },
    encryption: {
        key: process.env.encryptionKey,
    },
    firebaseConfig:{
        apiKey:process.env.firebase_apiKey,
        authDomain:process.env.firebase_authDomain,
        databaseURL:process.env.firebase_databaseURl,
        storageBucket:process.env.firebase_storageBucket
    },
    statuslist:{
        default:200,
        notFound:404,
        exception:500,
        unprocessEntity:422,
        unauthorized : 401
    },
    responseObj:(responseData=undefined,responseText)=>{
        if(_.isUndefined(responseData)){
            return {
                'responseText':responseText
            }
        }else{
            return {
                'responseData':responseData,
                'responseText':responseText
            }
        }

    },
    mailConfig:{
        username:process.env.mailUser,
        password:process.env.mailPassword,
        from : process.env.mailUser
    }

}