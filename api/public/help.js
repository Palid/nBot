"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    config = require('../../config/bot.js'),
    API = require('../../core/initialize/parseJSON.js');

var method = function help(options) {

    if (options.message.length > 0) {
        var splitted = _.pull(options.message.split(" "), "");
        var command = splitted[0];
        var lang = splitted.length >= 2 ? splitted[1] : config.options.defaultLang;
        var description = API[command].description[lang];

        if (description) {
            events.emit('apiSay', options.to, description);
        } else {
            events.emit('apiSay', options.to, "Couldn't find " + lang + " description for " + command);
        }

    } else {
        events.emit('apiSay', options.to, API.help.description[config.options.defaultLang]);
    }
};

var defaults = {
    description: {
        pl: ",help [komenda] [język] - Wyświetla opis dla [komenda] w [języku].",
        en: ",help [command] [lang] - Shows description for [command] in [lang]."
    },
    aliases: [
        "h"
    ]
};

module.exports = {
    method: method,
    defaults: defaults
};