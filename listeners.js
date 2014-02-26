"use strict";
var client = require('./config/bot.js'),
    logger = require('./privateMethods/log.js'),
    command = require('./privateMethods/checkCommand.js'),
    aliases = require('./initialize/');

// from = messaging user
// to = channel OR bot
// message = message$

client.addListener('message', function (from, to, message) {

    logger(true, to, '<' + from + '> ' + message + '\r\n');

    command(from, to, message);

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
    logger(true, 'error', message + '\r\n');
});

client.addListener('ircError', function (message) {
    console.log(message);
    logger(true, 'ircError', message + '\r\n');
});

client.addListener('raw', function (message) {
    logger(true, 'raw', JSON.stringify(message, null, 4));
});

console.info('nBot start');

// TODO
// PERMISSIONS SYSTEM
// That'll really be important...