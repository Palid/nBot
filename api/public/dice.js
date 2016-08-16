'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

// Lol overkill
function checkDice(dice) {
  if (_.isArray(dice)) {
    var map = _.map(dice, function (item) {
      return (!_.isNaN(parseInt(item, 10)) && item.length < 3);
    });
    return _.isUndefined(_.find(map, function (item) {
      return !item;
    }));
  } else return false;
}

var method = function rollDice(options) {
  var resultsList = [];
  var dice = options.message ? options.message.split('d', 2) : undefined;

  if (checkDice(dice)) {
    for (var i = 0; i < dice[1]; i++) {
      var x = Math.floor(Math.random() * dice[0] + 1);
      resultsList.push(x);
    }

    events.emit('apiSay', options.to, [
      'Throw results for',
      options.message,
      ':',
      resultsList.join(', '),
      'with final result of:',
      _.reduce(resultsList, function (sum, number) {
        return sum + number;
      })
    ].join(' '));
  } else {
    events.emit('apiSay',
            options.to,
            'Throw result is too long or is not a number. Example of valid dice throw: 2d10'
        );
  }
};

var defaults = {
  description: {
    pl: ',dice [i]d[n] - Rzuca [n](max 99) koścmi [i](max 99) razy.',
    en: ',dice [i]d[n] - Throws [n](max 99) dice [i](max 99) times.'
  },
  aliases: [
    'd',
    'roll'
  ]
};


module.exports = {
  method: method,
  defaults: defaults
};
