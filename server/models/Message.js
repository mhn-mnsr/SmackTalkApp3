const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    messageContent: String,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    team: [{ type: Schema.Types.ObjectId, ref: 'Team'}]
},
 { timestamps: true });


MessageSchema.statics.addTeamMessage = function (msg, tid,callback) {
    Message.find({_team:tid})
}

mongoose.model('Message', MessageSchema);
const Message = mongoose.model('Message');