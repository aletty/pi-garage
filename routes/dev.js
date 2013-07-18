var models = require('../models/models.js')
  , bcrypt = require('bcrypt');

exports.createUsers = function(req, res){
  //for dev purposes only
  var hashedarj = bcrypt.hashSync('arjun', 10);
  var hashedkar = bcrypt.hashSync('karan', 10);

  var arjunUser = new models.userModel({
    username: "arjun",
    email: "arjun.aletty@gmail.com",
    password: hashedarj
  });
  var karanUser = new models.userModel({
    email: "karanaletty95@gmail.com",
    username: "karan",
    password: hashedkar
  });

  arjunUser.save(function(err){
    if (err) return ('error saving arjunUser', err);
    console.log('Arjun saved');
  });

  karanUser.save(function(err){
    if(err) return('error saving karanUser', err);
    console.log('Karan saved');
  });
  res.send("users created");
}