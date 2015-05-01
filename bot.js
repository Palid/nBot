#!/usr/bin/env node

"use strict";

var events = require('events');
var config = require('./config/bot.js');
var dictionaries = require('./config/dictionaries');

var bot = {
    events: new events.EventEmitter(),
    getConfig: function getConfig(key) {
        return config.irc[key];
    },
    getOption: function getOption(key) {
        return config.options[key];
    },
    getDictionary: function getDict(key) {
      return dictionaries[key];
    }
};
module.exports = bot;

require('./core/')();


