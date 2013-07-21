
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , routes = require('./routes')
  , userRoute = require('./routes/user')
  , devRoute = require('./routes/dev')
  , models = require('./models/models.js')
  , path = require('path')
  , passport = require('passport')
  , pass = require('./routes/pass.js')
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
    app.use(express.methodOverride());
    //passport initialization
    app.use(passport.initialize());
    app.use(passport.session());
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

app.get('/', pass.ensureAuthenticated, routes.index);
app.get('/login', userRoute.getLogin);
app.post('/login', userRoute.postLogin);
app.get('/logout', userRoute.logout);
app.get('/createUsers', devRoute.createUsers);


server.listen(app.get('port'));