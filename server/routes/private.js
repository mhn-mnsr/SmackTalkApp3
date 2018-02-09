const express = require('express');
const router = express.Router();


let ensureAuthenticated = (req, res, next) =>{
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('login');
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

module.exports = router;
