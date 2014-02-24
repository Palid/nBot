/*jslint node: true */
"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    irc = require('irc'),
    client = require('./config/bot.js'),
    methods = require('./publicMethods/'),
    bot = require('./privateMethods/'),
    aliases = require('./index.js');

// from = messaging user
// to = channel OR bot
// message = message

client.addListener('message', function (from, to, message) {

    bot.log(true, to, '<' + from + '> ' + message + '\r\n');

    if (message.charAt(0) === client.commandCharacter) {
        message = message.replace(client.commandCharacter, '');
        var firstWhitespace = _.indexOf(message, ' '),
            body = (firstWhitespace !== -1) ? message.substring(firstWhitespace + 1) : "",
            command = (firstWhitespace !== -1) ? message.substring(0, firstWhitespace) : message;

        if (_.isUndefined(aliases[command])) {
            client.say(to, "Command " + command + " not found");
        } else {
            try {
                aliases[command](to, body, from);
            } catch (err) {
                bot.log(true, to, err);
                console.log(err);
                client.say(to, "Command " + command + " exited with an error.");
            }
        }

    }

});

client.addListener('pm', function (nick, message) {
    console.log('Got private message from %s: %s', nick, message);
});

client.addListener('ctcp', function (nick, message) {
    console.log('Got CTCP from %s: %s', nick, message);
});

client.addListener('join', function (channel, who) {
    console.log('%s has joined %s', who, channel);
});

client.addListener('part', function (channel, who, reason) {
    console.log('%s has left %s: %s', who, channel, reason);
});

client.addListener('kick', function (channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});

client.addListener('error', function (message) {
    console.log(message);
    bot.log(true, 'error', message + '\r\n');
});

client.addListener('ircError', function (message) {
    console.log(message);
    bot.log(true, 'ircError', message + '\r\n');
});

client.addListener('raw', function (message) {
    bot.log(true, 'raw', JSON.stringify(message) + '\r\n');
});

console.info('nBot start');

// TODO
// PERMISSIONS SYSTEM
// That'll really be important...