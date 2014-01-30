"use strict";
var irc = require('irc');

var client = new irc.Client('chat.freenode.net', 'nTest', {
	userName: 'nBot',
	realName: "Palid's IRC bot",
    channels: ['#nBot'],
    floodProtection: true,
    floodProtectionDelay: 500,
    messageSplit: 512
});

client.commandCharacter = ',';
client.login = "chomis";
client.password = "ILikeTrains";

module.exports = client;