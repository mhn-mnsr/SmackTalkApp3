const mongoose = require('mongoose');
// const User = require('./User');
let User;

if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', userSchema);
}

module.exports = User;
const TeamSchema = mongoose.Schema({
    teamName: { type: String},
    teamDescription: { type: String },
    _adminMembers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _pendingMembers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _message: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, {timestamp: true});

mongoose.model('Team', TeamSchema);

const Team = module.exports = mongoose.model('Team', TeamSchema);

// module.exports.createTeam = function(newTeam, callback){
//     newTeam.save(callback)}

module.exports.createTeam = (newTeam, callback)=>{
    newTeam.save(callback)}


module.exports.getTeamByName = (teamName, callback) => {
    let query = {teamName: teamName}
    Team.findOne(query, callback)
}
module.exports.getTeamsByUserId = (id,callback)=>{
    User.findById(id,callback)
}

module.exports.getTeamsMembers= (members, callback)=>{
    Team.findOne(id, callback)
}
// module.exports.updateTeam = (id, callback) => {

// }
