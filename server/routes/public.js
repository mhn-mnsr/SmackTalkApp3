const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('login',{title:'login'})
})

router.get('/register', (req,res)=>{
    res.render('register',{title:'register'})
})

router.get('/login', (req,res)=>{
    res.render('login',{title:'login'})
})

module.exports = router;