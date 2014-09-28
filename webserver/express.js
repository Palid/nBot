"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');

var _ = require('lodash');
var moment = require('moment');
var rek = require('rekuire');
var express = require('express');
var mongoose = require('mongoose');
var Drama = mongoose.model('Drama');


var loadDir = require('../helpers/loadDirectory.js');
var bot = rek('/bot.js');

var app = express();


function loadFile(currentDir, targetDir, encoding) {
  if (!encoding) encoding = "utf-8";
  return fs.readFileSync(path.resolve(currentDir, targetDir), encoding);
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//config
var allRoutes = ['drama', 'logs'];


var templates = loadDir('./templates', {
  currentDir: __dirname,
  type: '.html',
  recursive: true,
  require: false
});

var channels = bot.getConfig('channels');



_.forEach(channels, function(channel) {
  var lowerChan = channel.toLowerCase(),
    replaced = lowerChan.replace(/^#/, '');
  var cache,
    compiledTemplate;

  app.route('/logs/' + replaced)
    .get(function(req, res) {
      if (!cache || (Date.now() - cache) > (1000 * 60)) {
        fs.readFile(path.resolve(__dirname, util.format('../logs/channels/%s.log', lowerChan)), 'utf-8', function(err, logfile) {
          if (err) {
            res.send("Something wrong happened.");
          } else {
            compiledTemplate = _.template(templates.logs, {
              logs: logfile.split('\r\n'),
              channel: channel
            });
            console.log(compiledTemplate);
            console.log(cache);
            cache = Date.now();
            res.send(compiledTemplate);
          }
        });
      } else {
        res.send(compiledTemplate);
      }
    });

  app.route('/drama/' + replaced)
    .get(function(req, res) {
      Drama.find({
        channel: lowerChan
      }, function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
          var templated = _.template(templates.drama, {
            doc: doc,
            moment: moment
          });
          res.send(templated);
        }
      });
    });
});

var compiledHompage = _.template(templates.homepage, {
  channels: _.flatten(_.map(channels, function(item) {
    var channel = item.toLowerCase().replace(/^#/, '');
    return _.map(allRoutes, function(route) {
      return {
        url: util.format('/%s/%s', route, channel),
        name: util.format("%s: %s", capitalize(route), item)
      };
    });
  }))
});


app.get('/', function(req, res) {
  res.send(compiledHompage);
});

app.listen(bot.getOption('webserver').port);
