const Models = require('../db/models/Relational/index'),
    bcrypt = require('bcryptjs'),
    _ = require('lodash'),
    saltRounds = 10;




const commonFunction = {}

commonFunction.createTable = async () => {
    /**
     * Model Sync
     */
    try {
        for(let Model in Models){
            await Models[Model].sync({ force: false });
        }
    } catch (e) {
        console.error(`error:${e}`)
        return;
    }
}


commonFunction.createHashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject();
            } else {
                resolve(hash);
            }
        })
    })
}

commonFunction.checkPassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            if (err) {
                reject()
            } else {
                resolve(res)
            }
        })
    })
}

commonFunction.createCityCode = (city, state) => {
    return new Promise((resolve, reject) => {
        resolve(`${city}_${state}`)
    })
}

commonFunction.generatePassword =()=>{ 
    var pass = ''; 
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +  
            'abcdefghijklmnopqrstuvwxyz0123456789@#$'; 
      
    for (i = 1; i <= 8; i++) { 
        var char = Math.floor(Math.random() 
                    * str.length + 1); 
          
        pass += str.charAt(char) 
    } 
      
    return pass; 
} 



module.exports = commonFunction