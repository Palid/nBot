'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var mongoose = require('mongoose');
var Command = mongoose.model('Command');

var method = function list(options) {
  Command.find()
        .select('command')
        .exec()
        .then(function (doc) {
          var commands = _.map(doc, function (item) {
            return item.command;
          });
          events.emit('apiSay', options.to, 'Available commands: ' + commands.join(' '));
        });
};

var defaults = {
  description: {
    pl: ',list - Wyświetla listę komend.',
    en: ',list - Lists all commands.'
  },
  aliases: [
    'commands'
  ]
};

module.exports = {
  method: method,
  defaults: defaults
};
