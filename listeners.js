"use strict";
var client = require('./config/bot.js'),
    logger = require('./helpers/log.js'),
    command = require('./listener/checkCommand.js'),
    urlTitle = require('./listener/urlScrape.js'),
    sayError = require('./listener/sayError.js'),
    greeter = require('./listener/greeter.js');

require('./initialize/');
// from = messaging user
// to = channel OR bot
// message = message$

// TODO
// Regexp/indexOf command activation on listener.
// var REGEXP = {
//     command = client.commandCharacter,
//     url = require('../helpers/urlRe.js')
// };

client.addListener('message', function (from, to, message) {

    logger(true, to, '<' + from + '> ' + message + '\r\n');

    command(from, to, message);
    urlTitle(from, to, message);


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