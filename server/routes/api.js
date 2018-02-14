const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Team = mongoose.model('Team')



router.get('/', (req, res) => { res.send('API ROUTE') })

router.post('/register', (req, res) => {
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
})

passport.use(new LocalStrategy(
    function (username, password, done) {

        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/auth/home', failureRedirect: '/', failureFlash: true }),
    function (req, res) {
        res.render('home')
    });

let ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');//deal with you later :@
    }
}

router.get('/user', (req, res) => {
    res.json({
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName
    })
})

router.post('/updateProfile', (req, res) => {
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
})

router.get('/allUsers', ensureAuthenticated, (req, res) => {
    User.find({}, (err, user) => {
        res.json(user);
    })
})


router.get('/getProfile', ensureAuthenticated, (req, res) => {
    User.getUserById(req.user._id, (err, user) => {
        res.json(user)
    })
})

router.post('/createTeam', ensureAuthenticated, (req, res) => {
    let _ml = req.body.ml
    _ml = _ml.split(',')
    _ml.splice(0, 1)
    _ml.unshift(req.user._id.toString())
    req.checkBody('teamName', 'Please enter your team name').notEmpty()
    // req.checkBody('description', 'Please add description').notEmpty()
    // req.checkBody('_ml', 'Please add members').notEmpty()
    let errors = req.validationErrors()
    if (errors) res.render('home', { errors: errors })
    else {
        Team.getTeamByName(req.body.teamName, (err, team) => {
            if (err) throw (err)
            if (team) {
                req.flash('error_msg', `${req.body.teamName} has already been used, please try another one`)
                res.redirect('/auth/createTeam')
            } else {
                const newTeam = new Team({
                    _adminMembers: req.user._id,
                    teamName: req.body.teamName,
                    teamDescription: req.body.description,
                    _members: _ml
                })
                Team.createTeam(newTeam, (err, Team) => {
                    if (err) throw (err)
                    else {
                        for (user in _ml) {
                            User.findByIdAndUpdate(_ml[user], { $push: { _teams: newTeam._id } }, (err, doc) => {
                                if (err) throw err
                            })
                        }

                        req.flash('success_msg', `${req.body.teamName} has been created!`)
                        res.redirect('/auth/home')
                    }
                })
            }
        })
    }
})

router.get('/teamManager', ensureAuthenticated, (req, res) => {
    Team.getAdminTeams(req.user._id, (err, data) => {
        if (err) throw err
        res.json(data)
    })
})

router.get('/deleteUserFromTeam/:uid/:tid', (req, res) => {
    let uid = req.params.uid
    let tid = req.params.tid
    let admin = false
    Team.findByTId(tid, (err, data) => {
        if (err) throw err
        else {
            for (user in data._adminMembers) {
                if (data._adminMembers[user] == req.user._id.toString()) {
                    admin = !admin
                    break
                }
            }
            if (admin){
                Team.findByTIdAndUpdate(tid, { $pull: { _members: uid,_adminMembers:uid } }, (err, data) => {
                        if (err) throw err
                        else {
                            res.json({ msg: "User deleted",done: true })
                            return
                        }
                    }) //added functionality to remove other admins
            }else{
                res.json({ msg: "You're not an admin of this team", done: false })
                return
            }
        }
    })
})

module.exports = router;


