#!/usr/bin/env node

"use strict";

var events = require('events');
var config = require('./config/bot.js');
var oAuth = require('./config/oAuth.js');
var dictionaries = require('./config/dictionaries');

var bot = {
    events: new events.EventEmitter(),
    getConfig: function getConfig(key) {
        return config.irc[key];
    },
    getOption: function getOption(key) {
        return config.options[key];
    },
    getAuth: function getAuth(key) {
        return oAuth[key];
    },
    getDictionary: function getDict(key, lang) {
        if (lang) {
            if (dictionaries[key][lang]) return dictionaries[key][lang];
            else return dictionaries[key][bot.getOption('defaultLang')];
        } else {
            return dictionaries[key];
        }
    }
};
module.exports = bot;

require('./core/')();