const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');



router.get('/', (req,res)=>{
    res.send('API ROUTE')
})

router.post('/register',(req,res)=>{
    //variables
    let email = req.body.email
    let username = req.body.username
    let password = req.body.password
    let confirmPassword = req.body.confirmPassword
    //validation
    req.checkBody('email', 'Please enter your email').notEmpty()
    req.checkBody('username', 'Please enter your username').notEmpty()
    req.checkBody('email', 'Please enter a valid email').isEmail()
    req.checkBody('username', 'Minimum length is 4, Maximum is 10').isLength({min:4,max:10})
    req.checkBody('password', 'Your password and your confirmed password should match').equals(confirmPassword)
    req.checkBody('password', 'Password should be at least 6 characters').isLength({min:6})
    //validation errors
    let errors = req.validationErrors()
    if (errors) res.render('register', {title: 'Register', errors:errors})
    else{
        User.findOne({'local.username': username}, (err,user)=>{
            if (err) return done(err)
            if (user) return done(null,false, req.flash('signupMessage', `${username} already exists, try something else!`))
            else{
                let newUser = new User({
                    email: email,
                    username: username,
                    password: password
                })
                try{
                    User.createUser(newUser,(err,user)=>{
                        if (err) throw err
                    })
                    req.flash('success_msg',`${username} has been created!`)
                    res.redirect('/')
                }
                catch (err){}
            }
        })
    }
})
module.exports = router;