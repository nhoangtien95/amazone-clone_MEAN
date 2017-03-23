var router = require('express').Router();
var user = require('../models/user');
var Product = require('../models/products');
var Cart = require('../models/cart');

function paginate(req, res, next){
  var perPage = 9;
  var page = req.params.page;

  Product
    .find()
    .skip( perPage * page)
    .limit(perPage)
    .populate('category')
    .exec(function(err, products){
      Product.count().exec(function(err, count){
        if (err) next(err);

        res.render('main/product-main',{
          products: products,
          pages: count / perPage
        })
      });
    });
}

router.get('/', function(req , res, next){
  if (req.user){
    paginate(req, res, next);
  } else {
    res.render('main/home');
  }
});

router.post('/product/:product_id', function(req , res, next){
  Cart.findOne({ owner: req.user._id}, function(err, cart){
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

    cart.save(function (err){
      if (err) return next(err);
      return res.redirect('/cart');
    });
  });
});

router.get('/page/:page', function(req, res, next){
  paginate(req, res ,next);
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
      res.render('main/category', {
        products: products
      });
    });
});

router.get('/product/:id', function(req, res, next){
  Product.findById({ _id: req.params.id}, function(err, product){
    if (err) return next(err);

    res.render('main/product', {
      product: product
    });
  });
});

router.post('/product/:product_id', function (req, res, next)
{
  Cart.findOne( { owner: req.user._id}, function(err, cart){
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFiexed(2);

    cart.save(function(err) {
      if (err) return next(err);
      return res.redirect('/cart');
    });

  });
});

router.get('/cart', function (req, res, next){
  Cart
    .findOne({ owner : req.user._id})
    .populate('items.item')
    .exec(function(err, cart){
      if (err) return next(err);
      res.redirect('main/cart',{
        cart: cart
      });
    });
});

router.post('/remove', function (req, res, next){
  Cart.findOne({owner: req.user._id}, function (err, cart){
    cart.items.pull(String(req.body.item));

    cart.total = (cart.total - parseFloat(req.body.price).toFixed(2));
    cart.save(function(err, found){
      if (err) return next(err);

      req.flash('remove', 'Success removed item');
      res.redirect('/cart');
    });
  });
});


module.exports = router;
