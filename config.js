var irc = require('irc');

var client = new irc.Client('chat.freenode.net', 'chomis', {
	userName: 'nBot',
	realName: "Palid's IRC bot",
    channels: ['#nBot'],
    floodProtection: true,
    floodProtectionDelay: 500,
    messageSplit: 512
});

var commandCharacter = ',';

var login = "chomis",
	password = "ILikeTrains";

var freenodeLogin = function(){
	client.say("nickserv", "/IDENTIFY" + " " + login + " " + password );
};

module.exports = client;