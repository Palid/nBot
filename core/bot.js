"use strict";
var fs = require('fs'),
    path = require('path'),
    irc = require('irc'),
    config = require('../config/bot.js');

var client = new irc.Client(config.irc.network, config.irc.nick, {
    userName: config.irc.userName,
    realName: config.irc.realName,
    channels: config.irc.channels,
    floodProtection: config.irc.floodProtection,
    floodProtectionDelay: config.irc.floodProtectionDelay,
    messageSplit: config.irc.messageSplit,
    sasl: config.irc.sasl,
    login: config.irc.login,
    password: config.irc.password
});

client.options = config.options;

module.exports = client;