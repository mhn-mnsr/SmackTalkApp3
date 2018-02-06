const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('index',{title:'SmackTalk'})
})

router.get('/register', (req,res)=>{
    res.send('PUBLIC ROUTE')
})

router.get('/login', (req,res)=>{
    res.send('PUBLIC ROUTE')
})

module.exports = router;