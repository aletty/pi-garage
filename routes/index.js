
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Aletty Garage', user: req.user });
};