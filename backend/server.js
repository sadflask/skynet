var express = require('express');
var app = express();
var config = require('config');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var port = process.env.PORT || 4500;

mongoose.connect(config.get('DBHost'));
console.log("Mongodb location: " +config.DBHost);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

require('./api/reaction.js').setApp(app);
 app.listen(port);
// Console will print the message
console.log('Server running at: '+ port);

module.exports = app;
