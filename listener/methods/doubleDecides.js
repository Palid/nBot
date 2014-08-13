"use strict";
var rek = require('rekuire');
var bot = rek('/bot.js');

var method = function doubleDecides(from, to, message) {
    bot.events.emit('apiSay', to, Math.floor(Math.random() * 100));
};

module.exports = {
    method: method,
    re: /((duble decyduj)|(double decide))/g
};