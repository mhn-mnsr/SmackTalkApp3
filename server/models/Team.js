const mongoose = require('mongoose');
const TeamSchema = mongoose.Schema({
    teamName: { type: String},
    teamDescription: { type: String },
    _members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    _message: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
}, {timestamp: true});

mongoose.model('Team', TeamSchema);

var Team = mongoose.model('Team');