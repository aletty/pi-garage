
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();

var server = require('http').createServer(app)
  , io = require('socket.io-client')
  , routes = require('./routes')
  , index = require('./routes/index')
  , http = require('http')
  , path = require('path')
  , async = require('async')
  , gpio = require('pi-gpio')
  , config = require('./config.js')
  , notify = require('./notify.js');

// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routing
app.get('/', routes.index);

//initialize server
server.listen(app.get('port'));


//helper function
function delayPinWrite(pin, value, callback) {
  setTimeout(function() {
    gpio.write(pin, value, callback);
  }, config.relayTimeout);
}


//communication with server via sockets
var socket = io.connect('http://aletty.herokuapp.com/pi');

socket.on('connect', function() {
  console.log('connected on pi (yummy)');
});

//ensure gpio pins are closed
gpio.close(config.magnetPin);
gpio.close(config.garagePin);

//garage open logic
socket.on('start garage', function() {
  async.series([
    function (callback) {
      //open pin for output
      gpio.open(config.garagePin, {direction: 'output'}, callback);
    },
    function (callback) {
      //turn the relay on
      gpio.write(config.garagePin, config.relayOn, callback);
    },
    function (callback) {
      //turn the relay off after 500ms (simulate button press)
      delayPinWrite(config.garagePin, config.relayOff, callback);
    },
    function (err, results) {
      setTimeout( function () {
        //close pin
        gpio.close(config.garagePin);
        socket.emit('finish garage');
      }, config.relayTimeout);
    }
  ]);
});

//setup magnetic door sensor
gpio.open(config.magnetPin, {direction: 'input', pull: 'pullup'}, function (err) {
  if (err) {
    console.log('open error');
    gpio.close(config.magnetPin);
  }
});

var currentMagVal = 0;

function checkMagnet() {
  gpio.read(config.magnetPin, function (err, value) {
    if (err) console.log(err);
    if (value != currentMagVal){
      currentMagVal = value;
      notify.push(null, currentMagVal, 'garage');
    }
  });
}

setInterval(checkMagnet, 1000);
