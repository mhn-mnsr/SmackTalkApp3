const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb')


app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist'));
app.use(session({secret: 'codingdojorocks', saveUninitialized: true, resave: true}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use(passport.initialize());
app.use(passport.session());

require('./config/db.js');
const routes_setter = require('./config/routes.js');

routes_setter(app);


// app.use('/user', user);
// app.use('/messages', messages)
// app.use('/teams',teams)


app.set('port', process.env.port || 8000);

app.listen(app.get('port'), function(){
	console.log('Server started on port ' +app.get('port'));
});
