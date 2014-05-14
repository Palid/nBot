"use strict";
var _ = require('lodash'),
    events = require('../helpers/events.js'),
    hotLoad = require('../helpers/hotload.js'),
    config = hotLoad(__dirname, '../initialize/parseJSON.js');

events.on('configChanged', function () {
    config = hotLoad(__dirname, '../initialize/parseJSON.js');
});

var method = function alias(options) {
    var channel = options.to,
        data = options.message;

    if (_.has(config, data)) {
        var list = "",
            objList = "";
        _.forEach(config[data].aliases, function (property) {
            if (_.isObject(property)) {
                objList = objList + (property.alias + " ");
            } else {
                list = list + (property + " ");
            }

        });

        return {
            type: "say",
            to: channel,
            message: [
                "Simple aliases for " + data + ": " + list,
                "Complex aliases for " + data + ": " + objList
            ].join("\n\r")
        };
    } else {
        return {
            type: "say",
            to: channel,
            message: "Command not found."
        };
    }

};

var defaults = {
    description: {
        pl: ",alias [cmd]- Wyświetla listę aliasów dla komendy.",
        en: ",alias [cmd]- Lists all aliases for command."
    },
    aliases: [
        "aliases"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};