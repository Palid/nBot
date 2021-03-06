'use strict';
var figlet = require('figlet');
var rek = require('rekuire');
var events = rek('/bot.js').events;


var method = function shout(options) {
  var channel = options.to,
    data = options.message;

  figlet(data, function (err, data) {
    if (err) {
      console.dir(err);
      events.emit('apiSay', channel, 'Error: ' + err.message);
    }
    if (data.length > 500) {
      events.emit('apiSay', channel, 'String is too long.');
    } else {
      events.emit('apiSay', channel, data.split('\n'));
    }
  });
};

var defaults = {
  description: {
    pl: ',shout [string] - Bot wykrzykuje [string].',
    en: ',shout [string] - Bot shouts [string].'
  },
  aliases: []
};


module.exports = {
  method: method,
  defaults: defaults
};
