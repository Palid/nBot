'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;


var method = function pick(options) {
  const channel = options.to;
  const data = options.message;
  const res = _.chain(data)
    .split(' ')
    .shuffle()
    .join(' > ')
    .value();

  events.emit('apiSay', channel, res);
};

var defaults = {
  description: {
    pl: ',pick [str1] [str2]... - Wyświetla posortowaną listę.',
    en: ',pick [str1] [str2]... - Shows sorted list..'
  },
  aliases: [
    'choose'
  ]
};


module.exports = {
  method: method,
  defaults: defaults
};
