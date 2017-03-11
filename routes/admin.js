var router = require('express').Router();
var Category = require('../models/category');


router.get('/add-category', function(req, res, next){
  res.render('admin/add-category', {message: req.flash('success') });
});

router.post('/add-category', function (req, res, next){
  var category = new Category();
  category.name = req.body.category_name;

  category.save(function(err){
    if(err) return next(err);

    req.flash('success', 'Thêm thành công category mới .');
    return res.redirect('/add-category');
  });
});

module.exports = router;
