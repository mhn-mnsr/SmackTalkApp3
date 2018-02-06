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

mongoose.model("User", UserSchema);
const User = mongoose.model('User');
