/*jslint node: true */
var crypto = require('crypto'),
    _ = require('lodash'),
    client = require('../config/bot.js');

/**
 * Method Created by Jakub 'alabaster' Kubiak
 * Modified and implemented by Dariusz 'phoelid' Niemczyk
 */

var method = function (channel, data) {
    client.say(channel, _.forEach(_.forEach(data.split(" ").slice(0),
        function (word) {
            return [word, crypto.createHash('sha1').update(word).digest('hex')];
        }
    ).sort(function (x, y) {
        return x[1] > y[1];
    }), function (x) {
        return x[0];
    }).join(' < '));

};

var defaults = {
    description: {
        pl: ",pick [str1] [str2]...- Wyświetla posortowaną listę.",
        eng: ",pick [str1] [str2]...- Shows sorted list.."
    },
    aliases: [
        "choose"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};