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
    res.render('home', {title: 'Success'})
})




module.exports = router;