
/*
 * GET users listing.
 */
var models = require('../models/models.js');

exports.login = function(req, res){
  res.render('login', { title: 'Please Login' });
};