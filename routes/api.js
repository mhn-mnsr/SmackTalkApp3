const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Team = mongoose.model('Team')


let isTeamAdmin = (tid,req) =>{
    let admin = false
    for(t in req.user._adminTeams){
        if (req.user._adminTeams[t] == tid) return admin = true
    }
    return admin
}
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
//might need below function for another function if so must be refactored
router.get('/allUsers', ensureAuthenticated, (req, res) => {
    User.find({}, (err, user) => {
        res.json(user);
    })
}) 


router.get('/getProfile', ensureAuthenticated, (req, res) => {
    User.getUserById(req.user._id, (err, user) => {
        user = {_teams:user._teams,
                _adminTeams:user._adminTeams,
                _id:user._id,
                username:user.username,
                firstName:user.firstName,
                lastName:user.lastName}
        res.json(user)
    })
})//come back to this

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
                            if(_ml[user] == req.user._id){
                                User.findByIdAndUpdate(_ml[user], { $push: { _teams: newTeam._id,_adminTeams: newTeam._id } }, (err, doc) => {
                                    if (err) throw err
                                })
                            }else{
                                User.findByIdAndUpdate(_ml[user], { $push: { _teams: newTeam._id} }, (err, doc) => {
                                    if (err) throw err
                                })
                            }
                        }

                        req.flash('success_msg', `${req.body.teamName} has been created!`)
                        res.redirect('/auth/home')
                    }
                })
            }
        })
    }
})
router.get('/getUserTeams', ensureAuthenticated, (req,res)=>{
    User.getUserTeams(req.user._id, (err,data)=>{
        if (err) throw err
        res.json(data)
    })
})
router.get('/getTeamsMessages',ensureAuthenticated,(req,res)=>{
    User.getTeamsMessages(req.user._id, (err,data)=>{
        if (err) throw err
        res.json(data)
    })
})
router.get('/teamManager', ensureAuthenticated, (req, res) => {
    Team.getAdminTeams(req.user._id, (err, data) => {
        if (err) throw err
        res.json(data)
    })
})

router.get('/deleteUserFromTeam/:uid/:tid', ensureAuthenticated, (req, res) => {
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
            if (admin) {
                Team.findByTIdAndUpdate(tid, { $pull: { _members: uid, _adminMembers: uid } }, (err, data) => {
                    if (err) throw err
                    else {
                        User.findByIdAndUpdate(uid, { $pull: { _teams: tid } }, (err) => {
                            if (err) throw err
                            else {
                                res.json({ msg: "User deleted", done: true })
                                return
                            }
                        })
                    }
                }) //added functionality to remove other admins
            } else {
                res.json({ msg: "You're not an admin of this team", done: false })
                return
            }
        }
    })
})

router.post('/joinTeam', ensureAuthenticated,(req, res) => {// parent function
    let tname = req.body.tname
    let duplicate = false
    let pDuplicate = false
    Team.getTeamByName(tname, (err, data) => {
        if (!data) {
            req.flash('error_msg', 'Team does not exist!')
            res.redirect('/auth/joinTeam')
            return
        }
        else {
            data._members.forEach(e => {
                if (e == req.user._id) {
                    duplicate = !duplicate
                    return
                }
            })
            data._pendingMembers.forEach(e=>{
                if(e==req.user._id){
                    pDuplicate = !pDuplicate
                    return
                }
            })
            if (pDuplicate){
                req.flash('error_msg', `Your request is still pending with ${tname}`)
                res.redirect('/auth/joinTeam')
                return
            }
            if (duplicate) {
                req.flash('error_msg', "You're already a memeber of this team")
                res.redirect('/auth/joinTeam')
                return
            }
            else {
                Team.getTeamByNameAndAddMember(tname, req.user._id, (err) => { if (err) throw err })
                req.flash('success_msg', `Request sent to ${tname}`)
                res.redirect('/auth/joinTeam')
                return
            }
        }

    })
})
router.get('/getPendingRequests', ensureAuthenticated, (req, res)=> {
	Team.pendingRequests(req.user._id, (err, data)=>{
		if (err) throw err
		res.json(data)
	})
})

router.get('/joinTeam', ensureAuthenticated, (req,res)=> {
    //joinTeam?accept=1&tid=45678656467&uid=456743567
    let accept = req.query.accept
    accept = accept == 1 ? true : false
    let tid = req.query.tid
    let uid = req.query.uid
    let admin = isTeamAdmin(tid,req)
    if(admin){
        if (accept){
            Team.findByTIdAndUpdate(tid, {$pull: {_pendingMembers: uid},$push:{_members: uid}},(err, data)=>{
                if (err) throw err
                User.findByIdAndUpdate(uid,{$push:{_teams:tid}}).then(res.json({msgType:'success_msg', msg: `User has been accepted`}))
            })

        }else{
            Team.findByTIdAndUpdate(tid, {$pull: {_pendingMembers: uid}}, (err, data)=>{
                if (err) throw err
                res.json({done:true, error_msg: `User has been rejected`})//drop all ur db and create 2 users and create a team without the user, then request to join then accept
            })
        }
    }
    else{
        res.json({done:false,error_msg:`You're not admin of the team`})
    }
})//
module.exports = router;