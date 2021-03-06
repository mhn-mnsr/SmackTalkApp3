const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Team = mongoose.model('Team')

router.get('/', (req,res)=>{
    if(!req.user)
        res.render('login',{title:'Login'})
    else
        res.redirect('/auth/home')
})

router.get('/register', (req,res)=>{
    res.render('register',{title:'register'})
})

router.get('/login', (req,res)=>{
    res.render('login',{title:'login'})
})


module.exports = router;