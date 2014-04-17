"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    logger = require('../helpers/log.js'),
    commandsRe = require('./commandsRegexp.js'),
    sayError = require('./sayError.js'),
    greeter = require('./greeter.js');

// from = messaging user
// to = channel OR bot
// message = message$

client.addListener('message', function (from, to, message) {

    if (client.nick === to) {
        logger({
            timeStamp: true,
            fileName: from,
            data: '<' + from + '> ' + message + '\r\n'
        });
        commandsRe(to, from, message);
    } else {
        logger({
            timeStamp: true,
            fileName: to,
            data: '<' + from + '> ' + message + '\r\n'
        });
        commandsRe(from, to, message);
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
    // greeter(channel, who);
});

client.addListener('part', function (channel, who, reason) {
    console.log('%s has left %s: %s', who, channel, reason);
});

client.addListener('kick', function (channel, who, by, reason) {
    console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
});

client.addListener('error', function (message) {
    console.log(message);
    sayError(message);
    logger({
        timeStamp: true,
        fileName: 'error',
        data: message + '\r\n'
    });
});

client.addListener('ircError', function (message) {
    console.log(message);
    logger({
        timeStamp: true,
        fileName: 'ircError',
        data: message + '\r\n'
    });
});

client.addListener('raw', function (message) {
    logger({
        timeStamp: true,
        fileName: 'raw',
        data: JSON.stringify(message, null, 4)
    });
});

console.info('nBot start');

// TODO
// PERMISSIONS SYSTEM
// That'll really be important...