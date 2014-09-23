"use strict";

var fs = require('fs');
var path = require('path');

var _ = require('lodash');
var moment = require('moment');
var rek = require('rekuire');
var express = require('express');
var mongoose = require('mongoose');
var Drama = mongoose.model('Drama');

var bot = rek('/bot.js');

var app = express();

function loadFile(currentDir, targetDir, encoding) {
  if (!encoding) encoding = "utf-8";
  return fs.readFileSync(path.resolve(currentDir, targetDir), encoding);
}

var tpl = loadFile(__dirname, './dramaTemplate.html');

var channels = bot.getConfig('channels');

_.forEach(channels, function(channel) {
  var lowerChan = channel.toLowerCase();
  app.route('/' + lowerChan.replace(/^#/, ''))
    .get(function(req, res) {
      Drama.find({
        channel: lowerChan
      }, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
          var templated = _.template(tpl, {
            doc: doc,
            moment: moment
          });
          res.send(templated);
        }
      });
    });
});

app.get('/', function(req, res) {
  Drama.find({}, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      var templated = _.template(tpl, {
        doc: doc,
        moment: moment
      });
      res.send(templated);
    }
  });

});

app.listen(bot.getOption('webserver').port);

