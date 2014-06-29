/*jshint multistr: true */
"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

var mongoose = require('mongoose');
var Command = mongoose.model('Command');

var method = function alias(options) {

    Command.findOne({
        'aliases.alias': options.message.trim()
    }).exec().then(function (doc) {
        if (doc) {
            var aliases = _.map(doc.aliases, function (item) {
                var prepend = '';
                if (item.options.data) {
                    prepend += "d";
                }
                if (item.options.to) {
                    prepend += "t";
                }
                if (item.options.from) {
                    prepend += "f";
                }
                return ((prepend ? "[" + prepend + "]" : '') + item.alias);
            });
            events.emit(
                'apiSay',
                options.to,
                "Aliases for " + doc.command + ": " + aliases.join(", ")
            );
        } else {
            events.emit('apiSay', options.to, 'Command or alias "' + options.message + '" not found.');
        }
    });

};

var defaults = {
    description: {
        pl: ",alias [cmd]- Wyświetla listę aliasów dla komendy.\
            [d] - zmienione dane wejściowe. [t] - zmieniony odbiorca. [f] - zmieniony adresat",
        en: ",alias [cmd]- Lists all aliases for command.\
            [d] - changed input. [t] - changed destination. [f] - changed sender."
    },
    aliases: [
        "aliases"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};