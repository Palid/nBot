/*jslint node: true */
"use strict";
var irc = require('irc');

var client = new irc.Client('chat.freenode.net', 'exampleNick', {
    userName: "aBot",
    realName: "That is my real name",
    channels: ['#example.channel'],
    floodProtection: true,
    floodProtectionDelay: 500,
    messageSplit: 512,
    sasl: true,
    login: "bot",
    password: "saslPassword"
});

client.commandCharacter = ',';
client.defaultLang = "en";


module.exports = client;