var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var user = require('../models/user');



// serialize & deserialize
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  user.findById(id, function(err, user){
    done(err, user);
  });
});

//middleware
passport.use('local-login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  user.findOne( {email: email}, function(err, user){
    if (err) return done(err);

    if(!user){
      return done(null, false, req.flash('loginMessage', 'Tài khoản không tồn tại '));
    }

    if(!user.comparePassword(password)){
      return done(null, false, req.flash('loginMessage', 'Mật khẩu không chính xác '));
    }

    return done(null, user);
  });
}));



//costum function to validate
exports.isAuthenticated = function(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');

}
