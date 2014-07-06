"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var eightBallDictionary = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful "
];

var method = function eightBall(options) {
    if (options.message && options.message.trim().length > 0) {
        events.emit("apiSay", options.to, eightBallDictionary[_.random(0, eightBallDictionary.length)]);
    } else {
        events.emit("apiSay", options.to, "I need a thing to predict future on.");
    }

};

//
var defaults = {
    description: {
        pl: ",8ball [wiadomość] - Bot przewiduje przyszłość dla [wiadomości]",
        en: ",8ball [message] - Bot predicts future for [message]"
    },
    aliases: [],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};