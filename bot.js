#!/usr/bin/env node

"use strict";

var events = require('events');

var config = require('./config/bot.js');
var oAuth = require('./config/oAuth.js');

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
    }
};
module.exports = bot;

require('./core/')();