const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    _teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
    _adminTeams:[{type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: []}],
    _messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, 
{ timestamps: true })

  

UserSchema.statics.createUser = function (newUser, callback) {
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

UserSchema.statics.getUserTeams = function(id, callback) {
    User.findById(id).
    select('-_id _teams').
    populate({path:'_teams',select:'teamName'}).
    exec(callback)
}

UserSchema.statics.getTeamsMessages = function(id, callback) {
    User.findById(id).
    select('-_id _teams').
    populate({path:'_teams',select:'teamName _messages _id'}).
    exec(callback)
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

UserSchema.statics.isTeamAdmin = (tid,req) =>{
    let admin = false
    console.log('running from models..')
    for(t in req.user._adminTeams){
        if (req.user._adminTeams[t] == tid) return admin = true
    }
    return admin
}

UserSchema.statics.registerUser = (req,res) =>{
    console.log('Running from models')
    //variables
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    //validation
    req.checkBody('email', 'Please enter your email').notEmpty()
    req.checkBody('username', 'Please enter your username').notEmpty()
    req.checkBody('email', 'Please enter a valid email').isEmail()
    req.checkBody('username', 'Minimum length is 4, Maximum is 10').isLength({ min: 4, max: 10 })
    req.checkBody('password', 'Your password and your confirmed password should match').equals(confirmPassword)
    req.checkBody('password', 'Password should be at least 6 characters').isLength({ min: 6 })
    //validation errors
    let errors = req.validationErrors()
    if (errors) res.render('register', { title: 'Register', errors: errors })
    else {
        User.findOne({ 'local.username': username }, (err, user) => {
            if (err) return done(err)
            if (user) return done(null, false, req.flash('signupMessage', `${username} already exists, try something else!`))
            else {
                let newUser = new User({
                    email: email,
                    username: username,
                    password: password
                })
                try {
                    User.createUser(newUser, (err, user) => {
                        if (err) throw err
                    })
                    req.flash('success_msg', `${username} has been created!`)
                    res.redirect('/login')
                }
                catch (err) { }
            }
        })
    }
}

UserSchema.statics.getUser = (req,res) =>{
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName
    })
}

UserSchema.statics.updateProfile = (req,res) =>{
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let username = req.body.username

    req.checkBody('firstName', 'Please enter your first name').notEmpty()
    req.checkBody('lastName', 'Please enter your last name').notEmpty()
    req.checkBody('username', 'Please enter your username').notEmpty()

    let errors = req.validationErrors()
    if (errors) res.render('register', { title: 'Register', errors: errors })
    else {
        User.getUserByUsername(username, (err, user) => {
            if (err) throw (err)
            if (user && user._id.toString() !== req.user._id.toString()) {
                req.flash('error_msg', 'Username already exists')
                res.redirect('/')
            }
            else {

                User.findByIdAndUpdate(req.user._id, { $set: { 'firstName': firstName, 'username': username, 'lastName': lastName } }, (err, user) => {
                    if (err) throw (err)
                    req.flash('success_msg', 'Profile updated successfully')
                    res.redirect('/')

                })
            }
        })
    }
}

UserSchema.statics.allUsers = (req,res) =>{
    User.find({}, {password: 0},(err, user) => {
        console.log(user)
        res.json(user);
    })
}

UserSchema.statics.getProfile = (req,res) =>{
    User.findById(req.user._id,{password:0}, (err, user) => {
        res.json(user)
    })
}
const User = mongoose.model('User', UserSchema);