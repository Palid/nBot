"use strict";
var client = require('../core/bot.js'),
    logger = require('../helpers/log.js'),
    commandsRe = require('./commandsRegexp.js'),
    sayError = require('./sayError.js');

// from = messaging user
// to = channel OR bot
// message = message$

client.addListener('message', function (from, to, message) {
    var fromLower = from.toLowerCase(),
        toLower = to.toLowerCase(),
        nick = client.nick.toLowerCase();

    if (nick === toLower) {
        logger({
            timeStamp: true,
            fileName: fromLower,
            data: '<' + fromLower + '> ' + message + '\r\n'
        });
        commandsRe(toLower, fromLower, message);
    } else {
        logger({
            timeStamp: true,
            fileName: toLower,
            data: '<' + fromLower + '> ' + message + '\r\n'
        });
        commandsRe(fromLower, toLower, message);
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
    sayError(message);
    logger({
        timeStamp: true,
        fileName: 'error',
        data: JSON.stringify(message, null, 4) + '\r\n'
    });
});

client.addListener('ircError', function (message) {
    console.log(message);
    logger({
        timeStamp: true,
        fileName: 'ircError',
        data: JSON.stringify(message, null, 4) + '\r\n'
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

// Autokiller if 'deleteMe!' is true
// created for building the app on drone.io
if (client.options['deleteMe!']) {
    console.error("client.options['deleteMe!'] isn't deleted!");
    console.error("Gracefully exiting in 10000ms");
    setTimeout(function buildKiller() {
        console.log("Timeout, initialize exit.");
        process.exit(0);
    }, 10000);
}