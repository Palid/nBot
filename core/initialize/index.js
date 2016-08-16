'use strict';
var _ = require('lodash');
var rek = require('rekuire');

var mongoose = require('mongoose'),
  User = mongoose.model('User');
var root = rek('/bot.js').getOption('root');

function createRoot(nick) {
  User.findOne({
    nick: nick
  }, function (err, doc) {
    if (err) console.log(err);
    if (!doc || doc.length < 1) {
      User.create({
        nick: nick,
        permissions: {
          group: 'root',
          level: 5
        }
      }, function (err) {
        if (err) console.log(err);
        console.log('Creating root document for %s', nick);
      });
    } else {
      doc.permissions = {
        level: 5
      };
      doc.save(function (err) {
        if (err) console.log(err);
      });
      console.log('Creating root document for %s', nick);
    }
  });
}

mongoose.connection.once('open', function () {
  if (_.isArray(root)) {
    _.forEach(root, function (value) {
      createRoot(value);
    });
  } else {
    createRoot(root);
  }
});
