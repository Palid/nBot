'use strict';
const _ = require('lodash');
var rek = require('rekuire');
var bot = rek('/bot.js');

var method = function doubleDecides(from, to /*message*/) {
  bot.events.emit('apiSay', to, _.random(100));
};

module.exports = {
  method: method,
  messageRe: /((duble decyduj)|(double decide))/g
};
