/*jslint loopfunc: true */

"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    path = require('path'),
    methods = require('./publicMethods/'),
    bot = require('./privateMethods/'),
    configDir = path.resolve(__dirname, "./config/aliases.json");


var initialize = function (data) {

    for (var property in methods) {

        if (!_.has(data, property)) {
            data[property] = {
                aliases: methods[property].defaults.aliases,
                description: methods[property].defaults.description
            };
        }
    }

    var stringify = JSON.stringify(data, null, 4);

    fs.writeFile(configDir, stringify, function (err) {
        if (err) {
            console.log(err);
        }
    });

    module.exports = aliasList;
};

var createList = function (data) {
    var aliasesList = {};

    var collection = _.mapValues(data, function (el) {
        return el.aliases;
    });

    for (var property in collection) {

        aliasesList[property] = methods[property].method;

        for (var i = 0, len = collection[property].length; i < len; i++) {
            /** 
             * I'm not really sure if returning method is better than just
             * defining it to the dictionary. Need to benchmark this stuff.
             */
            aliasesList[collection[property][i]] = function (channel, data, user) {
                return methods[property].method;
            };

        }
    }
    return aliasesList;
};

var checkIfExists = function (dir) {

    if (fs.existsSync(dir)) {
        var parseData;

        try {
            parsedData = bot.readConfig;
        } catch (e) {
            fs.unlink(dir, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return {};
        }
        if (!_.isObject(parsedData)) {
            fs.unlink(dir, function (err) {
                if (err) {
                    console.log(err)
                }
            });
            return {};
        }

        return parsedData;
    } else {
        return {};
    }
};

var parsed = checkIfExists(configDir),
    aliasList = (_.isNull(parsed)) ? {} : createList(parsed);

initialize(parsed);