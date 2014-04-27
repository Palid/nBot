"use strict";
var irc = require('irc'),
    client = new irc.Client('chat.freenode.net', 'exampleNick', {
        userName: "aBot",
        realName: "That is my real name",
        channels: ['#example.channel'],
        floodProtection: true,
        floodProtectionDelay: 100,
        messageSplit: 512,
        sasl: true,
        login: "bot",
        password: "saslPassword"
    });

client.options = {
    commandCharacter: ',',
    defaultLang: 'en',
    urlScrapeTitle: '↳ title: '
};

module.exports = client;