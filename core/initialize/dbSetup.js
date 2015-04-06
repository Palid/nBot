"use strict";
var path = require('path');
var rek = require('rekuire');
var Datastore = require('nedb');
var db = new Datastore(path.resolve(__dirname, '../../nbot'));

db.loadDatabase(function(err) {
  if (err){
    console.log(err.stack);
  }
});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("Connected to database.");
});

console.log('Running mongoose version %s', mongoose.version);
