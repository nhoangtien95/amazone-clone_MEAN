var mongoose = require('mongoose');
var Schema = mongoose.Shema;

var CategorySchema = new mongoose.Schema({
  name:
  {
    type: String,
    unique: true,
    lowercase: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
