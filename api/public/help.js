"use strict";
var _ = require('lodash'),
    config = require('../../config/bot.js'),
    events = require('../../helpers/events.js'),
    hotLoad = require('node-hotload').hotLoad,
    config = hotLoad(__dirname, '../../core/initialize/parseJSON.js');

events.on('configChanged', function () {
    config = hotLoad(__dirname, '../../core/initialize/parseJSON.js');
});

var method = function help(options) {
    var firstWhitespace, command, getLang, lang, response,
        channel = options.to,
        data = options.message;


    if (data.length > 0) {
        firstWhitespace = _.indexOf(data, ' ');
        command = (firstWhitespace > 0) ? data.substring(0, firstWhitespace) : data;
        getLang = data.substring(firstWhitespace + 1);
        lang = (firstWhitespace > 0) ? getLang : config.options.defaultLang;
        response = (!_.isUndefined(config[command])) ? config[command].description[lang] :
            "Couldn't find " + lang + " description for " + command;
    } else {
        response = config.help.description[config.options.defaultLang];
    }
    events.emit('apiSay', channel, response);

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