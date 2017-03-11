var router = require('express').Router();
var user = require('../models/user');


router.get('/', function(req , res){
  res.render('main/home');
})

router.get('/about', function(req, res){
  res.render('main/about');
})


module.exports = router;
