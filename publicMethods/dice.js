/*jslint node: true */
"use strict";
var _ = require('lodash'),
    irc = require('irc'),
    client = require('../config/bot.js');


var method = function (channel, data) {

    var firstWhitespace = _.indexOf(data, ' '),
        d = _.indexOf(data, 'd'),
        diceThrows = parseInt(data.substring(firstWhitespace, d), 10),
        dices = parseInt(data.substring(d + 1, data.length), 10),
        finalResult = null,
        resultsList = "";

    if (!_.isNaN(dices) && !_.isNaN(diceThrows)) {
        console.log(_.isNumber(dices));
        console.log(_.isNumber(diceThrows));

        for (var i = 0; i < diceThrows; i++) {
            var x = Math.floor(Math.random() * dices + 1);
            finalResult += x;
            resultsList += x.toString() + ", ";
        }

        return client.say(channel, "Throw results for " + data + ": " + resultsList + "with final result of: " + finalResult);
    } else {
        return client.say(channel, "Throw result is not a number. Example of valid dice throw: 2d10");

    }

};

var defaults = {
    description: {
        pl: ",dice [i]d[n] - Rzuca [n] koścmi [i] razy.",
        eng: ",dice [i]d[n] - Throws [n] dices [i] times."
    },
    aliases: [
        "d",
        "roll"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};