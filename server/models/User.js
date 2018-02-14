const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    _teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
    _messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, 
{ timestamps: true })


UserSchema.statics.createUser = function (newUser, callback) {
    console.log('I started');
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

UserSchema.statics.getUserByUsername = function(username, callback) {
    let query = { username: username }
    User.findOne(query, callback)
}



UserSchema.statics.getUserById = function (id, callback) {
    User.findById(id, callback)
}
UserSchema.statics.comparePassword  = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}
                            
                            
const User = mongoose.model('User', UserSchema);