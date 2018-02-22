const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Team = mongoose.model('Team')


let ensureAuthenticated = (req, res, next) =>{
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('../login');
	}
}
router.get('/', (req,res)=>{
    res.send('PRIVATE ROUTE')
})

router.get('/home', ensureAuthenticated, (req,res)=>{
    res.render('home', {title: 'Home'})
})

router.get('/createTeam', ensureAuthenticated, (req, res)=> {
	res.render('createTeam', {title: 'Create a Team'})
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
})

router.get('/usersTeams', ensureAuthenticated, (req,res)=> {
	Team.getAdminTeams(req.user._id,(err,data)=>{
        if (err) throw err
        res.render('usersTeams', {title: 'Team Manager',data:data})
    })
})

router.get('/joinTeam', ensureAuthenticated, (req, res)=> {
	res.render('joinTeam', {title: 'Join Team'})
})

// router.get('/joinRequests', ensureAuthenticated, (req, res)=> {
// 	Team.joinRequests(req.Team._id, (err, data)=>{
// 		if (err) throw err
// 		res.render('joinRequests', {title: 'Join Team', data:data})
// 	})
// })

module.exports = router;
