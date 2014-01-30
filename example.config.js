"use strict";
var irc = require('irc');

var client = new irc.Client('chat.freenode.net', 'exampleNick', {
	userName: 'nBot',
	realName: "Palid's IRC bot",
    channels: ['#example.channel'],
    floodProtection: true,
    floodProtectionDelay: 500,
    messageSplit: 512
});

client.commandCharacter = ',';
client.login = "login";
client.password = "password";


module.exports = client;