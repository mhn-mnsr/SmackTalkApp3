const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/sta3');


const db = mongoose.connection;

module.exports.db = db