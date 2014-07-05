"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var config = rek('config/bot.js');
var mongoose = require('mongoose');
var Command = mongoose.model('Command');

function getDescription(doc, lang) {
    var desc = _.find(doc.description, function (item) {
        return item.lang === lang;
    });
    return desc.description ? desc.description : undefined;
}

var method = function help(options) {

    if (options.message.length > 0) {
        var splitted = _.pull(options.message.split(" "), "");
        var command = splitted[0];
        var lang = splitted.length >= 2 ? splitted[1] : config.options.defaultLang;

        Command.findOne({
            command: command
        }).exec().then(function (doc) {
            if (doc) {
                var description = getDescription(doc, lang);
                if (description) {
                    events.emit('apiSay', options.to, description);
                } else {
                    events.emit('apiSay', options.to, "Couldn't find " + lang + " description for " + command);
                }
            }
        });
    } else {
        Command.findOne({
            command: 'help'
        }).exec().then(function (doc) {
            events.emit('apiSay', options.to, getDescription(doc, config.options.defaultLang));
        });
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