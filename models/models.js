var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
  name: String,
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

exports.User = User;