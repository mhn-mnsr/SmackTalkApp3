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

// if (!mongoose.models.Team)
// else    
//     Team = mongoose.model('Team');

module.exports = TeamSchema

module.exports.createTeam = (newTeam, callback)=>{
    newTeam.save(callback)
}

module.exports.getTeamByName = (teamName, callback) => {
    let query = {teamName: teamName}
    Team.findOne(query, callback)
}

module.exports.getTeamsByUserId = (id,callback)=>{
    User.findById(id,callback)
}

module.exports.getAdminTeams = (id,callback) => {
    Team.find({_adminMembers: id})
    .select('_id _adminMembers _members _pendingMembers teamName')
    .populate('_members')
    .exec(callback)
}
module.exports.findByTId = (id,callback) => {
    Team.findById(id,callback)
}

// module.exports.findByTIdAndUpdate = (tid,update,callback) =>{
    //     Team.findByIdAndUpdate(tid,update,callback)
    // }
    
    module.exports.findByTIdAndUpdate = (query,update,callback) =>{
        Team.findAndUpdate(query,update,callback)
    }
const Team = module.exports = mongoose.model('Team', TeamSchema);