"use strict";
var _ = require('lodash');
var rek = require('rekuire');
var methods = rek('api');

var mongoose = require('mongoose');
var Command = mongoose.model('Command');

var method = function () {
    Command.find().exec().then(function (doc) {
        _.forEach(methods, function (item, key) {
            var description = _.map(item.defaults.description, function (item, key) {
                return {
                    lang: key,
                    description: item
                };
            });
            var aliases = _.map(item.defaults.aliases, function (item) {
                if (_.isObject(item)) {
                    return {
                        alias: item.alias,
                        options: item.options
                    };
                } else {
                    return {
                        alias: item
                    };
                }
            });
            aliases.push({
                alias: key
            });
            if (!_.has(doc, key)) {
                Command.create({
                    command: key,
                    level: item.defaults.level || 0,
                    aliases: aliases,
                    description: description
                }, function (err) {
                    if (err) console.log(err);
                });
            }
        });
    });
};


console.log("Creating aliases.json");

module.exports = method();