/*jslint node: true */
"use strict";
const irc = require('irc'),
fs = require('fs');

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
client.login = "login";
client.password = "password";
client.log = function (name, data) {

    function timestamp() {

        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes(),
            seconds = currentTime.getSeconds();

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return "[" + hours + ":" + minutes + ":" + seconds + "]";
    }

    var time = timestamp();

    fs.appendFile("logs/" + name + ".log", time + " " + data, function (err) {
        if (err) console.log(err);
    });
};


module.exports = client;