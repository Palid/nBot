"use strict";
var crypto = require('crypto'),
    _ = require('lodash'),
    events = require('../helpers/events.js');



function encrypt(word) {
    var hash = crypto.createHash('sha1')
        .update(word)
        .digest('hex');

    return hash;
}


var method = function pick(options) {
    var channel = options.to,
        data = options.message,
        arr = [],
        sorted = [],
        string = data.split(" ");


    _.forEach(string, function (item) {
        var encrypted = encrypt(item),
            index = _.sortedIndex(arr, encrypted);
        if (index >= 1) {
            arr.push(encrypted);
            sorted.push(item);
        } else {
            arr.unshift(encrypted);
            sorted.unshift(item);
        }
    });

    events.emit('apiSay', channel, sorted.join(" > "));

};

var defaults = {
    description: {
        pl: ",pick [str1] [str2]... - Wyświetla posortowaną listę.",
        en: ",pick [str1] [str2]... - Shows sorted list.."
    },
    aliases: [
        "choose"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};