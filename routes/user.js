var passport = require('passport');

//login page
exports.getLogin = function(req, res) {
  res.render('login', { title: 'Please Login', user: req.user, message: req.session.messages });
};

exports.postLogin = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {return next(err); }
    if (!user) {
      req.session.messages = [info.message];
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
};

//logout user
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
