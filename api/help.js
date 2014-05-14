"use strict";
var _ = require('lodash'),
    client = require('../config/bot.js'),
    watch = require('../helpers/events.js'),
    hotLoad = require('../helpers/hotload.js'),
    config = hotLoad(__dirname, '../initialize/parseJSON.js');

watch.on('configChanged', function () {
    config = hotLoad(__dirname, '../initialize/parseJSON.js');
});

var method = function help(options) {
    var firstWhitespace, command, getLang, lang, response,
        channel = options.to,
        data = options.message;


    if (data.length > 0) {
        firstWhitespace = _.indexOf(data, ' ');
        command = (firstWhitespace > 0) ? data.substring(0, firstWhitespace) : data;
        getLang = data.substring(firstWhitespace + 1);
        lang = (firstWhitespace > 0) ? getLang : client.options.defaultLang;
        response = (!_.isUndefined(config[command])) ? config[command].description[lang] :
            "Couldn't find " + lang + " description for " + command;
    } else {
        response = config.help.description[client.options.defaultLang];
    }
    return {
        type: "say",
        to: channel,
        message: response
    };

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