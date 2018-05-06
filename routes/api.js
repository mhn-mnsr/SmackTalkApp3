const express = require('express');
const router = express.Router();
const passportPolicy = require('../policies/passport');
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Team = mongoose.model('Team')


router.get('/', (req, res) => { res.send('API ROUTE') })

router.post('/register', (req,res)=>{User.registerUser(req,res)})

router.post('/login',
    passportPolicy.passport.authenticate('local', { successRedirect: '/auth/home', failureRedirect: '/', failureFlash: true }),
    function (req, res) {
        res.render('home')
    });

let ensureAuthenticated = (req, res, next) => {
    passportPolicy.Authenticated(req,res,next)
}

router.get('/user', (req, res) => {User.getUser(req,res)})

router.post('/updateProfile', (req, res) => {User.updateProfile(req,res)})
//might need below function for another function if so must be refactored
router.get('/allUsers', ensureAuthenticated, (req, res) => {User.allUsers(req,res)})


router.get('/getProfile', ensureAuthenticated, (req, res) => {User.getProfile(req,res)})//come back to this

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
    let admin = User.isTeamAdmin(tid,req)
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