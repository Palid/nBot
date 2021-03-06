'use strict';

var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var jsesc = require('jsesc');

var bot = rek('/bot.js');
var events = bot.events;
var commandCharacter = bot.getOption('commandCharacter');
var maxResponseTime = (bot.getOption('maxResponseTime') || 10);
var maxMessageRows = (bot.getOption('maxMessageRows') || 5);
var client = rek('core/bot.js');

var API = rek('api');

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Command = mongoose.model('Command');


function Throttler() {
  var self = this;
  this.__GLOBAL__ = {
    messages: [],
    waitingForGo: false
  };
  _.forEach(bot.getConfig('channels'), function (channel) {
    var currentThrottle = {
      messages: {
        current: [],
        toResolve: [],
      },
      waitingForGo: false,
      isPending: false,
    };
    self[_.toLower(channel)] = currentThrottle;
  });
}

var antiSpam = new Throttler();

function breakAroundSpace(str) {
  var parts = [];
  var match = str.match(/^[\s\S]{1,80}\S*/);
  var prefix = match[0];
  parts.push(prefix);
  // Strip leading space.
  str = str.substring(prefix.length).trim();
  if (str) {
    parts.push(str);
  }
  return parts;
}


function pushToThrottle(to, message) {
  var currentObj = antiSpam[to];
  if (!currentObj) {
    antiSpam[to] = [];
    currentObj = antiSpam[to];
    currentObj.messages = {};
    currentObj.messages.current = [];
    currentObj.messages.toResolve = [];
    currentObj.waitingForGo = false;
    currentObj.isPending = false;
  }
  antiSpam.__GLOBAL__.messages.push(message);
  antiSpam[to].messages.current.push(message);
}

function unloadQueue(to, unloadFlag) {
  var currentThrottle = antiSpam[to];
  debugger;
  if (
    unloadFlag ||
    (
      (currentThrottle.messages.current.length || currentThrottle.messages.toResolve.length) > maxMessageRows
    )
  ) {
    if (currentThrottle.messages.toResolve.length === 0 || (currentThrottle.messages.current.length > 0 && currentThrottle.messages.toResolve.length > 0)) {
      currentThrottle.messages.toResolve = currentThrottle.messages.current;
      currentThrottle.messages.current = [];
    }
    if (currentThrottle.waitingForGo) {
      clearTimeout(currentThrottle.timeout);
    }
    client.say(to, util.format('(%ss)If you want me to continue, say: %sgo', maxResponseTime, commandCharacter));
    currentThrottle.waitingForGo = true;
    currentThrottle.timeout = setTimeout(function () {
      currentThrottle.waitingForGo = false;
    }, maxResponseTime * 1000);
  } else {
    while (currentThrottle.messages.current.length > 0) {
      var message = currentThrottle.messages.current.shift();
      if (message.length < 300) {
        client.say(to, message);
      } else {
        _.forEach(breakAroundSpace(message), function (item) {
          currentThrottle.messages.current.push(item);
        });
        unloadQueue(to, true);
      }
    }
  }
}

function goOn(to, options) {
  if (!options) options = {};
  var currentThrottle = antiSpam[to],
    estimatedSize = currentThrottle.messages.toResolve.length - maxMessageRows,
    finalSize = estimatedSize >= 0 ? estimatedSize : 0;
  if (!currentThrottle.isPending) {
    currentThrottle.isPending = true;
    currentThrottle.waitingForGo = false;
    clearTimeout(currentThrottle.timeout);
    while (currentThrottle.messages.toResolve.length > finalSize) {
      client.say(to, currentThrottle.messages.toResolve.shift());
    }
    currentThrottle.isPending = false;
    if (currentThrottle.messages.toResolve.length > 0) unloadQueue(to);
    else if (currentThrottle.messages.toResolve.length >= maxMessageRows) {
      client.say(to, util.format('(%ss)If you want me to continue, say: %sgo', maxResponseTime, commandCharacter));
    }
  } else if (!options.userActivated) {
    setTimeout(function () {
      goOn(to);
    }, bot.getConfig('floodProtectionDelay'));
  }
}


function useApi(commandMap, from, to, body) {
  try {
    if (commandMap.options) {
      antiSpam[to].push();
      API[commandMap.command].method({
        from: commandMap.options.from ? commandMap.options.from : from,
        to: commandMap.options.to ? commandMap.options.to : to,
        message: commandMap.options.data ? commandMap.options.data : body
      });
    } else {
      API[commandMap.command].method({
        from: from,
        message: body,
        to: to
      });
    }
  } catch (err) {
    console.log(err);
    client.say(to, 'Command ' + commandMap.command + ' exited with an error.');
  }
}

events.on('apiSay', function (channel, message) {
  if (_.isArray(message) || _.isObject(message)) {
    _.forEach(message, function (property) {
      pushToThrottle(channel, property);
    });
  } else {
    pushToThrottle(channel, String(message));
  }
  unloadQueue(channel);
});

events.on('apiCommand', function (response) {
  var nickBool = !!response.nick,
    messageBool = !!response.message;
  if (nickBool && messageBool) {
    return client.send(response.command, response.to, response.nick, response.message);
  } else if (messageBool) {
    return client.send(response.command, response.to, response.message);
  } else {
    return client.send(response.command, response.to, response.nick);
  }
});


/**
 * [activateCommand description]
 *
 * @param  {String} from - user from which the message was send
 * @param  {String} to - channel/user to which the message was send
 * @param  {String} message - message send
 * @param  {Array} match - result from RegExp.match()
 * @return {string} - may return an error
 */
var method = function activateCommand(from, to, message, match) {
  var splitted = _.pull(message.split(' '), '');
  var command = splitted[0].replace(match[0], '');
  var body = splitted.length >= 2 ? splitted.slice(1, splitted.length).join(' ') : '';

  if (command === 'go') {
    goOn(to, {
      userActivated: true
    });
  } else {
    Command.findOne({
      'aliases.alias': command,
    }).exec()
      .then(function (cmdDoc) {
        if (!cmdDoc) {
          client.say(from, util.format('Command %s not found. Try: %slist', command, bot.getOption('commandCharacter')));
        } else {
          var options = _.find(cmdDoc.aliases, function (item) {
            return item.alias === command && (item.options.data || item.options.to || item.options.from);
          });
          var commandMap = {
            command: cmdDoc.command,
            options: options ? options.options : undefined
          };

          if (cmdDoc.level > 0) {
            User.findOne({
              nick: from
            }, function (err, doc) {
              if (err) console.log(err);
              if (doc.permissions.level >= cmdDoc.level) {
                useApi(commandMap, from, to, body);
              } else {
                client.say(to, 'Access denied. Your permissions level ' +
                  doc.permissions.level + ' < ' + cmdDoc.level
                );
              }
            });
          } else {
            useApi(commandMap, from, to, body);
          }
        }
      });
  }
};

module.exports = {
  method: method,
  messageRe: new RegExp('^[' + jsesc(bot.getOption('commandCharacter')) +
    ']{' + bot.getOption('commandCharacter').length + '}')
};
