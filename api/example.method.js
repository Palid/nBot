'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

/**
 * [method Your New API Function]
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function nameYourFunctionForDebugging(options) {
  events.emit('apiSay', options.to, options.message);
    // events.emit("apiCommand", command, options.to, options.from, options.message);
};

//
var defaults = {
  description: {
    pl: ',komenda [data] - Bot robi [data]',
    en: ',command [data] - Bot does [data]'
  },
  aliases: [
    'command',
    'yourOwn'
  ],
  level: 0
};


module.exports = {
  method: method,
  defaults: defaults
};
