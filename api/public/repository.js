"use strict";
var util = require('util');
var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;
var botPackage = rek('/package.json');

var method = function returnRepository(options) {
    events.emit("apiSay", options.to,
        util.format(botPackage.version, botPackage.repository.url)
    );
};

var defaults = {
    description: {
        pl: ",repository - Bot zwraca link do swojego repozytorium.",
        en: ",repository - Bot returns url to his repository."
    },
    aliases: [
        "repo",
        "git"
    ],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};
