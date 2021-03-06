'use strict';
var rek = require('rekuire');
var events = rek('/bot.js').events;


var method = function topic(options) {
  events.emit('apiCommand', {
    type: 'command',
    command: 'TOPIC',
    to: options.to,
    message: options.message
  });
};

var defaults = {
  description: {
    pl: ',topic [string] - Zmienia temat kanału na [string].',
    en: ',topic [string] - Changes channel topic to [string].'
  },
  aliases: [
    't'
  ],
  level: 4
};


module.exports = {
  method: method,
  defaults: defaults
};
