const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('PUBLIC ROUTE')
})

module.exports = router;