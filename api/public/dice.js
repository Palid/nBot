"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js');

var method = function dice(options) {

    var channel = options.to,
        data = options.message;

    var d = _.indexOf(data, 'd'),
        diceThrows = parseInt(data.substring(_.indexOf(data, ' '), d), 10),
        dices = parseInt(data.substring(d + 1, data.length), 10),
        finalResult = null,
        resultsList = [];

    if (!_.isNaN(dices) && !_.isNaN(diceThrows) &&
        dices.toString().split("").length < 3 &&
        diceThrows.toString().split("").length < 3) {

        for (var i = 0; i < diceThrows; i++) {
            var x = Math.floor(Math.random() * dices + 1);
            finalResult += resultsList.push(x.toString());
        }

        events.emit('apiSay', channel, [
            "Throw results for",
            data,
            ":",
            resultsList.join(", "),
            "with final result of:",
            finalResult
        ].join(" "));

    } else {
        events.emit('apiSay',
            channel,
            "Throw result is too long or is not a number. Example of valid dice throw: 2d10"
        );
    }

};

var defaults = {
    description: {
        pl: ",dice [i]d[n] - Rzuca [n] koścmi [i] razy.",
        en: ",dice [i]d[n] - Throws [n] dices [i] times."
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