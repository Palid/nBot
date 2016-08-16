'use strict';
var util = require('util');
var _ = require('lodash');
var moment = require('moment');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;


var responses = bot.getDictionary('seen');


var method = function seen(options) {
  var split = _.pull(options.message.split(' '), ''),
    len = split.length,
    nick = len >= 2 ? split[0].toLowerCase() : options.message.trim().toLowerCase(),
    lang = len >= 2 ? split[1].trim().toLowerCase() : bot.getOption('defaultLang');

  if (nick === bot.getConfig('nick').toLowerCase()) {
    events.emit('apiSay',
            options.to,
            util.format(responses[lang].here)
        );
  } else {
    User.findOne({
      $and: [{
        $or: [{
          nick: nick
        }, {
          'aliases.alias': nick
        }]
      }, {
        'seen.channel': options.to
      }]
    }, function (err, doc) {
      if (err) console.log(err);
      if (doc) {
        var max = _.max(doc.seen, function (channels) {
          return channels.date;
        });
        var response;
        var dateWrapper = moment(max.date).lang(lang);
                // var min = _.min(doc.seen, function (channels) {
                //     return channels.date;
                // });
                // var currentChannel = _.find(doc.seen, function (channels) {
                //     return channels.channel === options.to;
                // });
        response = util.format(responses[lang].found,
                    doc.nick, dateWrapper.fromNow(), max.channel, max.message
                );
        if (max.message) {
          events.emit('apiSay', options.to, response);
        }
      } else {
        events.emit('apiSay',
                    options.to,
                    util.format(responses[lang].notFound)
                );
      }
    });
  }
};

var defaults = {
  description: {
    pl: ',seen [nick] [język] - Bot podaje datę ostatniej wiadomości [nick] w [języku]',
    en: ",seen [nick] [lang] - Bot says [nick]'s last message date in [lang]."
  },
  aliases: []
};

module.exports = {
  method: method,
  defaults: defaults
};
