
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , user = require('./routes/user')
  , dev = require('./routes/dev')
  , models = require('./models/models.js')
  , path = require('path')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , flash = require('connect-flash')
  , mongoose = require('mongoose');

// all environments
app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret : 'aboys'}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    var uristring = process.env.MONGODB_URI || 
    process.env.MONGOLAB_URI ||
    'mongodb://localhost/garage';
    var mongoOptions = {db : {safe: true}};

    mongoose.connect(uristring, mongoOptions, function(err, res){
      if (err){
        console.log('error connecting to: ' + uristring);
      } else{
        console.log('succeeded connecting to: ' + uristring);
      }
    });
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', user.login);
app.get('/createUsers', dev.createUsers);

server.listen(app.get('port'));