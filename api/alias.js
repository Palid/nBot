"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    watch = require('../initialize/watch.js'),
    hotLoad = require('../helpers/hotload.js'),
    config = require('../initialize/parseJSON.js'),
    aliases = require('../initialize/createAliasDict.js');

watch.on('configChanged', function () {
    aliases = hotLoad(__dirname, '../initialize/createAliasDict.js');
});

var method = function alias(options) {
    var channel = options.to,
        data = options.message;

    if (_.has(config, data)) {
        var list = "",
            objList = "";
        _.forEach(config[data].aliases, function (property) {
            if (_.isObject(property)) {
                console.log(property);
                objList = objList + (property.alias + " ");
            } else {
                console.log(property);
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