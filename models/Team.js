const mongoose = require('mongoose');
const User = mongoose.model('User')

const TeamSchema = mongoose.Schema({
    teamName: { type: String },
    teamDescription: { type: String },
    _adminMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _pendingMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    _messages: [],
}, { timestamp: true })


TeamSchema.statics.createTeam = function (newTeam, callback) {
    newTeam.save(callback)
}

TeamSchema.statics.getTeamByName = function (teamName, callback) {
    let query = { teamName: teamName }
    Team.findOne(query, callback)
}
TeamSchema.statics.getTeamByNameAndAddMember = function (teamName, memberId, callback) {
    let query = { teamName: teamName }
    Team.findOneAndUpdate(query, { $push: { _pendingMembers: memberId } }, callback)
}

TeamSchema.statics.getTeamsByUserId = function (id, callback) {
    User.findById(id, callback)
}

TeamSchema.statics.addTeamMessage = function (msgcontainer, callback) {
    Team.findByIdAndUpdate(msgcontainer.tid,{$push:{
        _messages:{
            user:msgcontainer.user,
            username:msgcontainer.username,
            message:msgcontainer.message,
            createdAt: msgcontainer.createdAt
        }}},(err,data)=>{if (err) throw err})
        callback
        
}

TeamSchema.statics.getAdminTeams = function (id, callback) {
    Team.find({ _adminMembers: id })
        .select('_id _adminMembers _members _pendingMembers teamName')
        .populate('_members')
        .exec(callback)
}

TeamSchema.statics.getUserTeams = function (id, callback) {
    Team.find({ _members: id },(err,data)=>console.log(data))
        // .select('_id _members teamName')
        // .populate('_members')
        // .exec(callback)
}

TeamSchema.statics.findByTId = function (id, callback) {
    Team.findById(id, callback)
}

TeamSchema.statics.findByTIdAndUpdate = (query, update, callback) => {
    Team.findByIdAndUpdate(query, update, callback)
}

TeamSchema.statics.pendingRequests = function (id, callback) {
    Team.find({ _adminMembers: id })
        .select('teamName _pendingMembers')
        .populate({path:'_pendingMembers',
                   select:'username firstName lastName'})//for formatting maybe? or you dont want them works for me now
        .exec(callback)
}


// TeamSchema.statics.acceptRequest = function (id, callback) {
//     Team.findByIdAndUpdate(id, callback)
// }

const Team = module.exports = mongoose.model('Team', TeamSchema);