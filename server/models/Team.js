const mongoose = require('mongoose');
const User = require('/User');
const TeamSchema = mongoose.Schema({
    teamName: { type: String},
    teamDescription: { type: String },
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _message: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {timestamp: true});

mongoose.model('Team', TeamSchema);

const Team = module.exports = mongoose.model('Team', TeamSchema);

module.exports.createTeam = function(newTeam, callback){
    newTeam.save(newTeam, callback)}

module.exports.getTeamById = (id, callback) => {
    Team.findById(id, callback)
}

module.exports.updateTeam = (id, callback) => {
    
}
