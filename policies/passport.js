const mongoose = require('mongoose');
const User = mongoose.model('User')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {

        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

module.exports.Authenticated = (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not logged in');
        res.redirect('/');//deal with you later :@
    }
}
module.exports.passport = passport
