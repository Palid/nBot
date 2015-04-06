"use strict";
var irc = require('irc'),
    config = require('../config/bot.js');

var client = new irc.Client(config.irc.network, config.irc.nick, {
    userName: config.irc.userName,
    realName: config.irc.realName,
    channels: config.irc.channels,
    port: config.irc.port || 6667,
    showErrors: config.irc.showErrors || false,
    autoRejoin: config.irc.autoRejoin,
    autoConnect: config.irc.autoConnect,
    retryCount: config.irc.retryCount,
    retryDelay: config.irc.retryDelay,
    floodProtection: config.irc.floodProtection,
    floodProtectionDelay: config.irc.floodProtectionDelay,
    messageSplit: config.irc.messageSplit,
    sasl: config.irc.sasl,
    login: config.irc.login,
    password: config.irc.password,
    secure: config.irc.secure,
    selfSigned: config.irc.selfSigned,
    certExpired: config.irc.certExpired,
    stripColors: config.irc.stripColors,
    channelPrefixes: config.irc.channelPrefixes
});
client.options = config.options;

module.exports = client;