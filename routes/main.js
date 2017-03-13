var router = require('express').Router();
var user = require('../models/user');
var Product = require('../models/products');


router.get('/', function(req , res){
  res.render('main/home');
});

router.get('/about', function(req, res){
  res.render('main/about');
});

router.get('/products/:id', function(req, res, next) {
  Product
    .find({ category : req.params.id })
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      console.log(products.length);
      res.render('main/category', {
        products: products
      });
    });
});


module.exports = router;
