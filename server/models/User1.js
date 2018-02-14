const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: {type: String},
    password: { type: String },
    _teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default:[] }],
    _messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true })
let User
if (!mongoose.models.User)
    User = module.exports = mongoose.model('User', UserSchema);
else
    User = mongoose.model('User')
module.exports = UserSchema
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = (username, callback) => {
    let query = { username: username }
    User.findOne(query, callback)
}
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback)
}

// module.exports.getAllUsers = (id, callback)=> {
//     User.find({},)
// }
module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}