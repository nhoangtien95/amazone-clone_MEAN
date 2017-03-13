var router = require('express').Router();
var async = require('async');
var faker = require('faker');
var Category = require('../models/category');
var Product = require('../models/products');

router.get('/:name', function(req, res, next){
  async.waterfall([
      function(callback){
        Category.findOne({ name: req.params.name }, function(err, category){
          if (err) return next(err);
          console.log('category: ' + category.name +' '+ category._id ) ;
          callback(null, category);
        });
      },

      function(category, callback){

        for (var i = 0; i < 30; i++){
          var product = new Product();
          product.category = category._id;
          product.name = faker.commerce.productName();
          product.price= faker.commerce.price();
          product.image = faker.image.image();
          product.save();
        }
      }

  ]);
  res.json({message: 'Success !!'});
});

module.exports = router;
