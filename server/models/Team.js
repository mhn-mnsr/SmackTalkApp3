const mongoose = require('mongoose');
const User = mongoose.model('User')

const TeamSchema = mongoose.Schema({
    teamName: { type: String},
    teamDescription: { type: String },
    _adminMembers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _pendingMembers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _message: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
}, {timestamp: true})


TeamSchema.statics.createTeam = function(newTeam, callback){
    newTeam.save(callback)
}

TeamSchema.statics.getTeamByName = function(teamName, callback) {
    let query = {teamName: teamName}
    Team.findOne(query, callback)
}

TeamSchema.statics.getTeamsByUserId = function(id,callback){
    User.findById(id,callback)
}

TeamSchema.statics.getAdminTeams = function(id,callback) {
    Team.find({_adminMembers: id})
    .select('_id _adminMembers _members _pendingMembers teamName')
    .populate('_members')
    .exec(callback)
}
TeamSchema.statics.findByTId = function(id,callback){
    Team.findById(id,callback)
}
    
TeamSchema.statics.findByTIdAndUpdate = (query,update,callback) =>{
    Team.findByIdAndUpdate(query,update,callback)
}

const Team = module.exports = mongoose.model('Team', TeamSchema);