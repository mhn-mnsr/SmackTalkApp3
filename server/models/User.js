import { isMaster } from 'cluster';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    password: { type: String },
    _teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    _messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true })

UserSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10).then(hashed_password => {
        this.password = hashed_password;
        next()
    }).catch(error => {
        next()
    });
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = (newUser,callback)=>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password, salt,(err,hash)=>{
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

module.exports.getUserByUsername = (username,callback) =>{
    let query = {username:username}
    User.findOne(query,callback)
}
module.exports.getUserByUsername = (id,callback) =>{
    User.findById(id,callback)
}
module.exports.comparePassword = (candidatePassword, hash, callback) =>{
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if (err) throw err
        callback(null,isMatch)
    })
}