'use strict';
var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');

var events = rek('/bot.js').events;

var Link = mongoose.model('Link');

var method = function nameYourFunctionForDebugging(options) {
  var limit = parseInt(options.message, 10);
  if (_.isNaN(limit)) {
    limit = 1;
  } else if (limit > 5) {
    limit = 5;
  }
  console.log(options);
  Link.find({
    channel: options.to
  }).sort('-lastPost').limit(limit).exec(function (err, links) {
    if (err) console.log(err);
    console.log(err);
    console.log(links);
    var linksMap = _.map(links, function (item) {
      return item.link;
    });
    linksMap.reverse();
    events.emit('apiSay', options.to, linksMap);
  });
};

//
var defaults = {
  description: {
    pl: ',lastlink [ilość] - Bot zwraca ostatnie [ilość] linków zapostowanych na kanale.',
    en: ',lastlink [amount] - Bot returns last [amount] links posted on this channel.'
  },
  aliases: [
    'll'
  ],
  level: 0
};


module.exports = {
  method: method,
  defaults: defaults
};
