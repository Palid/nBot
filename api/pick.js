"use strict";
var crypto = require('crypto'),
    _ = require('lodash');


function encrypt(word) {
    var hash = crypto.createHash('sha1')
        .update(word)
        .digest('hex');

    return hash;
}


var method = function (channel, data) {
    var arr = [],
        arr2 = [],
        string = data.split(" ");


    _.forEach(string, function (item) {
        var encrypted = encrypt(item),
            index = _.sortedIndex(arr, encrypted);
        if (index >= 1) {
            arr.push(encrypted);
            arr2.push(item);
        } else {
            arr.unshift(encrypted);
            arr2.unshift(item);
        }
    });

    return {
        type: "say",
        to: channel,
        message: arr2.join(" > ")
    };

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