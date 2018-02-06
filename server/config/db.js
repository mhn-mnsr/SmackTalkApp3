const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/smacktalk');


const db = mongoose.connection;

module.exports.db = db