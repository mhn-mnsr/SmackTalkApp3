const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('PRIVATE ROUTE')
})

module.exports = router;