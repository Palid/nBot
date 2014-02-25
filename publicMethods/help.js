"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    aliases = require('../privateMethods/readConfig.js');


var method = function (channel, data) {
    var firstWhitespace,
        command, getLang,
        lang, response;

    if (data.length > 0) {
        firstWhitespace = _.indexOf(data, ' ');
        command = (firstWhitespace > 0) ? data.substring(0, firstWhitespace) : data;
        getLang = data.substring(firstWhitespace + 1);
        lang = (firstWhitespace > 0) ? getLang : client.defaultLang;
        response = (!_.isUndefined(aliases[command])) ? aliases[command].description[lang] :
            "Couldn't find " + lang + " description for " + command;
    } else {
        // hardcoded english help
        response = aliases.help.description.en;
    }

    return client.say(channel, response);

};

var defaults = {
    description: {
        pl: ",help [komenda] - Wyświetla opis dla [komenda].",
        en: ",help [command] - Shows description for [command]."
    },
    aliases: [
        "h"
    ]
};

module.exports = {
    method: method,
    defaults: defaults
};