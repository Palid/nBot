"use strict";

var util = require('util');

var _ = require('lodash');
var rek = require('rekuire');
var jsesc = require('jsesc');

var bot = rek('/bot.js'),
  events = bot.events,
  commandCharacter = bot.getOption('commandCharacter'),
  maxResponseTime = (bot.getOption('maxResponseTime') || 10),
  maxMessageRows = (bot.getOption('maxMessageRows') || 5),
  client = rek('core/bot.js');



function Throttler() {
  var self = this;
  this.__GLOBAL__ = {};
  this.__GLOBAL__.messages = [];
  this.__GLOBAL__.waitingForGo = false;
  _.forEach(bot.getConfig('channels'), function (channel) {
    self[channel] = {};
    var currentThrottle = self[channel];
    currentThrottle.messages = {};
    currentThrottle.messages.current = [];
    currentThrottle.messages.toResolve = [];
    currentThrottle.waitingForGo = false;
    currentThrottle.isPending = false;
  });
}

var antiSpam = new Throttler();

function breakAroundSpace(str) {
  var parts = [],
    match = str.match(/^[\s\S]{1,80}\S*/);
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

