
const admins = require('./admins'),
      adds = require('./adds'),
      category = require('./category'),
      responses = require('./responses'),
      userProfile = require('./userProfile'),
      users = require('./users');

/**
 * @author Ronnie Sarma
 * @description Models relationship works starts here
 */

users.belongsTo(userProfile, { foreignKey: 'userid' });
users.hasMany(responses, { foreignKey: 'userid', constraints: false });
adds.hasMany(responses,{foreignKey:'ad_id',constraints: false });
category.hasMany(adds,{foreignKey:'categoryid',constraints:false});

module.exports = {
    admins: admins,
    adds : adds,
    category : category,
    responses: responses,
    userProfile: userProfile,
    users:users
}
