"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var events = rek('/bot.js').events;

/**
 * method letMeGoogleThatForYou
 * @param  {Object} options Options object always returned on API call
 * -       {String} to      Channel or user to which the API should respond
 * -       {String} from    User who made the API call
 * -       {String} message Parsed message without the command
 * @return {Emitter}        Returns an event when function's finished for parsing
 */
var method = function letMeGoogleThatForYou(options) {
    var split = options.message.split(' ');

    if (split && split.length >= 2) {
        var nick = split[0];
        var query = split.slice(1).join(" ");
        events.emit("apiSay", options.to, [nick, ":", " http://lmgtfy.com/?q=", query]);

    } else {
        events.emit("apiSay", options.to, "You need to provide two arguments: nick and query, both seperated by space.");
    }
};

//
var defaults = {
    description: {
        pl: ",lmgtfy [nick]* [zapytanie]* - Zwraca link do [zapytania] LMGTFY dla [nick]",
        en: ",lmgtfy [nick]* [query]* - Returns link for LMGTFY [query] for [nick]"
    },
    aliases: [
        "g4",
        "letmegooglethatforyou",
        "letmegooglethat",
        "googlefor"
    ],
    level: 0
};


module.exports = {
    method: method,
    defaults: defaults
};