'use strict';

var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var mongoose = require('mongoose');

var events = rek('/bot.js').events;
var User = mongoose.model('User');


var PRIVATE = {
  ban: function ban(options, status) {
    User.findByOptions(options, function (err, doc) {
      if (err) console.log(err);
      if (doc) {
        doc.permissions.isBanned = status;
        doc.save();
        events.emit('apiSay', options.to, util.format('User %s is now %s.', doc.nick, status ? 'banned' : 'unbanned'));
      } else {
        events.emit('apiSay', options.to,
                    'User either not specified or found.');
      }
    });
  }
};


var COMMANDS = {
  list: {
    level: 0,
    method: function list(options) {
      events.emit('apiSay', options.to,
                'List of user commands: ' +
                _.keys(COMMANDS).join(' ')
            );
    }
  },
  status: {
    level: 0,
    method: function getStatus(options) {
      User.findByOptions(options, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
          var nick = (doc.nick !== options.nick) ?
                        '[' + doc.nick + ']' + options.nick :
                        options.nick;
          events.emit('apiSay', options.to,
                        util.format("%s%s's permission status: level: %s", doc.permissions.isBanned ? '[BANNED]' : '', nick, doc.permissions.level)
                    );
        } else {
          events.emit('apiSay', options.to,
                        'User ' + options.nick + ' not found.'
                    );
        }
      });
    }
  },
  set: {
    level: 3,
    method: function setLevel(options) {
      var newLevel = parseInt(options.body.trim().split(' ')[0], 10);
      if (newLevel > 5) newLevel = 5;
      if (!_.isNaN(newLevel)) {
        User.findOne({
          nick: options.nick
        }, function (err, doc) {
          var self = doc;
          if (err) console.log(err);
          if (options.doc.permissions.level < self.permissions.level) {
            events.emit('apiSay', options.to,
                            "You can't change permissions for user of higher rank."
                        );
          } else if (newLevel > options.doc.permissions.level) {
            events.emit('apiSay', options.to,
                            "You can't change permission to higher rank than your own."
                        );
          } else if (doc.permissions.level === 5) {
            events.emit('apiSay', options.to, "You can't change root permissions.");
          } else {
            self.permissions.level = newLevel;
            self.save();
            events.emit('apiSay', options.to,
                            'Permission level updated for ' + options.nick + '.' +
                            ' Current level: ' + newLevel
                        );
          }
        });
      } else {
        events.emit('apiSay', options.to, 'Level is not a number.');
      }
    }
  },
  aliasAdd: {
    level: 3,
    method: function aliasAdd(options) {
      User.findByOptions(options, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
          var aliasFound = _.find(doc.aliases, function (item) {
            return item.alias === options.alias;
          });
          if (aliasFound) {
            events.emit('apiSay', options.to,
                            'User ' + options.nick +
                            ' already had alias ' + options.alias
                        );
          } else {
            User.update({
              nick: doc.nick
            }, {
              $addToSet: {
                aliases: {
                  alias: options.alias,
                  addedBy: options.from,
                  date: Date.now()
                }
              }
            }, function (err) {
              if (err) console.log(err);
              else events.emit('apiSay', options.to,
                                'Alias ' + options.alias + ' added for ' +
                                options.nick + '.'
                            );
            });
          }
        }
      });
    }
  },
  aliasDelete: {
    level: 3,
    method: function aliasDelete(options) {
      User.findByOptions(options, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
          User.update({
            _id: doc._id
          }, {
            $pull: {
              aliases: {
                alias: options.nick || options.alias
              }
            }
          }, function (err) {
            if (err) console.log(err);
            else events.emit('apiSay', options.to,
                            'Alias ' + options.alias + ' removed for ' +
                            options.nick + '.'
                        );
          });
        } else {
          events.emit('apiSay', options.to,
                        'Alias not found'
                    );
        }
      });
    }
  },
  alias: {
    level: 0,
    method: function alias(options) {
      User.findByOptions(options, function (err, doc) {
        if (err) console.log(err);
        if (doc) {
          var aliases = _(doc.aliases).map(function (item) {
            return item.alias;
          }).pull(doc.nick)
                        .value();
          events.emit('apiSay', options.to,
                        'Aliases for ' + doc.nick + ' are: ' + aliases.join(', ')
                    );
        } else {
          events.emit('apiSay', options.to,
                        'No user found.'
                    );
        }
      });
    }
  },
  ban: {
    level: 4,
    method: function ban(options) {
      PRIVATE.ban(options, true);
    }
  },
  unban: {
    level: 4,
    method: function unban(options) {
      PRIVATE.ban(options, false);
    }
  }
};

/**
 * user - main method acting as a hub for all user API calls
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function user(options) {
  var splitted = _.pull(options.message.split(' '), '');
  var len = splitted.length;
  var command = splitted[0];
  var nick = len >= 2 ? splitted[1].toLowerCase() : '';
  var body = len >= 3 ? splitted.slice(2, len).join(' ') : '';

  User.findOne({
    nick: options.from
  }, function (err, doc) {
    if (err) console.log(err);
    var currentCommand = command ? COMMANDS[command] : COMMANDS.list;
    if (currentCommand) {
      if (doc && doc.permissions.level >= currentCommand.level) {
        currentCommand.method({
          to: options.to,
          from: options.from,
          nick: nick,
          body: body.trim(),
          alias: body.trim().split(' ')[0],
          doc: doc
        });
      } else if (doc.permissions.level < currentCommand.level) {
        events.emit(options.to, 'Access denied. Your permissions level ' +
                    doc.permissions.level + ' < ' + currentCommand.level
                );
      }
    } else {
      COMMANDS.list.method(options);
    }
  });
};

var defaults = {
  description: {
    pl: ',user [komenda] [nick] - Zwraca [komenda] dla [nick]',
    en: ',user [komenda] [nick] - Returns [command] for [nick]'
  },
  aliases: [],
  level: 0
};


module.exports = {
  method: method,
  defaults: defaults
};
