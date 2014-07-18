"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;

var method = function eightBall(options) {
    var len = options.message.trim().length;
    var eightBallDictionary = bot.getDictionary('8ball');
    if (len > 0) {
        var messageLang = _.pull(options.message.split(" "), "")[0].toLowerCase();
        var lang = _.has(eightBallDictionary, messageLang) ? messageLang : bot.getOption('defaultLang');
        events.emit("apiSay", options.to, eightBallDictionary[lang][_.random(0, eightBallDictionary[lang].length)]);
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