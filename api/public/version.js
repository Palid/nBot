"use strict";
var util = require('util');
var _ = require('lodash');
var rek = require('rekuire');
var bot = rek('/bot.js');
var events = bot.events;
var botPackage = rek('/package.json');

var method = function returnVersion(options) {
    var split = _.pull(options.message.split(" "), ""),
        len = split.length,
        lang = len >= 1 ? split[1].trim().toLowerCase() : bot.getOption('defaultLang');

    var version = bot.getDictionary('version');
    events.emit("apiSay", options.to,
        util.format(version[lang], botPackage.version, botPackage.codename)
    );
};

var defaults = {
    description: {
        pl: ",version [data] - Bot robi [data]",
        en: ",version [data] - Bot does [data]"
    },
    aliases: [{
        alias: "wersja",
        options: {
            data: 'pl'
        }
    }, "v"],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};