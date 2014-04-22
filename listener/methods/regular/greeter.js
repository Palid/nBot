"use strict";
var client = require('../config/bot.js');

var GREETLIST = [
    "yo",
    "siema",
    "siemano",
    "siemaneczko",
    "co tam",
    "WAZZAAAAP",
    "cześć",
    "elo"
];

var BANNEDDICT = {
    nick: "sentence"
};

function method(channel, who) {

    var banned = BANNEDDICT[who],
        notBanned = Math.floor(Math.random() * GREETLIST.length);

    if (who === client.nick) {
        return client.say(channel, "Siema!");
    } else if (banned) {
        return client.say(channel, banned);
    } else {
        return client.say(channel, GREETLIST[notBanned] + " " + who);
    }

}


module.exports = method;