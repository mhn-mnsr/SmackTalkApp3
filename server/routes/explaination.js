let potato = (str,callback) => {
    callback
    console.log(str)
}

potato('im a string',
    console.log('im another string')
)


const mongoose = require('mongoose')
const Team = require('../models/Team')

Team.findOneAndUpdate