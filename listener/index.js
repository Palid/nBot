'use strict';
var rek = require('rekuire');

var client = rek('core/bot.js'),
  logger = rek('helpers/log.js'),
  commandsRe = require('./commandsRegexp.js');

var mongoose = require('mongoose');
var User = mongoose.model('User');


function sayError(message) {
  var length = message.args.length;
  if (length === 4) {
    return client.say(message.args[2], message.args[1] + ' ' + message.args[length - 1]);
  }
}

// from = messaging user
// to = channel OR bot
// message = message

client.addListener('message', function (from, to, message) {
  var fromLower = from.toLowerCase(),
    toLower = to.toLowerCase(),
    nick = client.nick.toLowerCase();

  User.findUser(from)
        .select('permissions.isBanned')
        .exec()
        .then(function (doc) {
          if (!doc || (doc && doc.permissions && !doc.permissions.isBanned)) {
            if (nick === toLower) {
              logger({
                timeStamp: true,
                fileName: 'users/' + fromLower,
                data: '<' + fromLower + '> ' + message + '\r\n'
              });
              commandsRe(toLower, fromLower, message.trim());
            } else {
              logger({
                timeStamp: true,
                fileName: 'channels/' + toLower,
                data: '<' + fromLower + '> ' + message + '\r\n'
              });
              commandsRe(fromLower, toLower, message.trim());
            }
          }
        });
});

// client.addListener('pm', function (nick, message) {
//     console.log('Got private message from %s: %s', nick, message);
// });

// client.addListener('ctcp', function (nick, message) {
//     console.log('Got CTCP from %s: %s', nick, message);
// });

// client.addListener('join', function (channel, who) {
//     console.log('%s has joined %s', who, channel);
// });

// client.addListener('part', function (channel, who, reason) {
//     console.log('%s has left %s: %s', who, channel, reason);
// });

// client.addListener('kick', function (channel, who, by, reason) {
//     console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
// });

client.addListener('error', function (message) {
  console.log(message);
  sayError(message);
  logger({
    timeStamp: true,
    fileName: 'error',
    data: JSON.stringify(message, null, 4) + '\r\n'
  });
});

client.addListener('ircError', function (message) {
  console.log(message);
  logger({
    timeStamp: true,
    fileName: 'ircError',
    data: JSON.stringify(message, null, 4) + '\r\n'
  });
});

client.addListener('raw', function (message) {
  logger({
    timeStamp: true,
    fileName: 'raw',
    data: JSON.stringify(message, null, 4)
  });
});

