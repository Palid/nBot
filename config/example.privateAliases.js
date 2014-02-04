"use strict";
const methods = require('../methods.js');

var aliases = {
    gtfo: function(data, nick, channel) {
        return methods.kick(data, nick, channel);
    }
};

module.exports = aliases;