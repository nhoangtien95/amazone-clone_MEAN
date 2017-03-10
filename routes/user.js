var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');


router.get('/login', function(req, res){
  if(req.user) return res.redirect('/');
  res.render('account/login', {  message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/profile', function(req, res, next){
  User.findOne({ _id : req.user._id }, function(err, user){
    if (err) return next(err);
    res.render('account/profile', { user: user});
  });
});

router.get('/signup', function(req , res){
  res.render('account/signup', {
    errors: req.flash('errors1')
  });
})

router.post('/signup', function(req, res, next){
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;
  user.profile.picture = user.avatar();

  User.findOne({ email: req.body.email}, function(err, existingUser){

    if (existingUser){
      req.flash('errors1', 'Email đã tồn tại ! ');
      return res.redirect('/signup');
    } else {
      user.save(function(err, user){
        if (err) return next(err);

        req.logIn(user, function(err){
          if(err) next(err);
          res.redirect('/profile');
        })
      });
    }

  });
});

router.get('/logout', function(req, res, next)
{
  req.logout();
  res.redirect('/');
})


module.exports = router;
