var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , models = require('../models/models.js');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  models.userModel.findOne({ username: username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {return done(null, false, { message: 'Unkown user ' + username }); }
    user.comparePassword(password, function (err, isMatch) {
      if (err) return done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid password'});
      }
    });
  });
}));

//middleware to ensure user is authenticated
exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {return next(); }
  res.redirect('/login');
}

//middleware to ensure user is admin
exports.ensureAdmin = function ensureAdmin(req, res, next) {
  return function(req, res, next) {
    if (req.user && req.user.admin === true)
      next();
    else
      res.send(403);
  }
}