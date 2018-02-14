var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
    messageContent: String,
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _team: [{ type: Schema.Types.ObjectId, ref: 'Team'}]
},
 { timestamps: true });

mongoose.model('Message', MessageSchema);

var Message = mongoose.model('Message');