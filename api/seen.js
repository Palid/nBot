"use strict";
var db = require('../initialize/db.js'),
    client = require('../config/bot.js');

var method = function seen(options) {

    if (options.message === client.nick) {
        return false;
    } else {
        var to = options.to;
        return {
            type: "say",
            to: to,
            nick: options.from,
            message: db[to].users[options.message].seen
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