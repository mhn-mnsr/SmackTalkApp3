const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb')
const mongoose = require("mongoose");
const server = require('http').createServer(app) 
const io = require('socket.io')(server)
require('./models/user')
require('./models/team')
require('./models/message')
const r_public = require('./routes/public')
const r_private = require('./routes/private')
const r_api = require('./routes/api')
const requestIp = require('request-ip');

require('./config/db.js');
require('./config/socket')(io)


app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  extname: '.hbs',
  partialsDir: './views/partials/',
  defaultLayout:'layout',
  helpers: require("./helpers/handlebars.js").helpers}));
app.set('view engine', '.hbs');

app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/img',express.static(path.join(__dirname, 'public/img')));

app.use(bodyParser.json())
app.use(requestIp.mw())
app.use(express.static(__dirname + '/client/dist'));
app.use(session({secret: 'codingdojorocks', saveUninitialized: true, resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.')
		, root    = namespace.shift()
		, formParam = root;
  
	  while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	  }
	  return {
		param : formParam,
		msg   : msg,
		value : value
	  };
	}
  }));  
app.use(flash());
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
  });

app.use('/', r_public);
app.use('/auth', r_private)
app.use('/api', r_api)

app.set('port', process.env.port || 8000)

server.listen(app.get('port'), function(){
	console.log('Server started on port ' +app.get('port'))
});

