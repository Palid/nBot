"use strict";
var _ = require('lodash'),
    db = require('../initialize/database/index.js'),
    client = require('../config/bot.js');

var method = function seen(options) {

    if (options.message === client.nick) {
        return false;
    } else {
        var to = db.get("channelUser", {
            to: options.to,
            from: options.from
        }),
            message = !_.isUndefined(to) ?
                to.seen :
                "I didn't see this user speak even once.";
        return {
            type: "say",
            to: options.to,
            nick: options.from,
            message: message
        };
    }

};

var defaults = {
    description: {
        pl: ",seen [nick] - Bot podaje datę ostatniej wiadomości [nick].",
        en: ",seen [nick] - Bot says [nick]'s last message date."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};