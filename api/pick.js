// "use strict";
// var crypto = require('crypto'),
//     _ = require('lodash'),
//     client = require('../config/bot.js');


// var method = function (channel, data) {
//     client.say(channel, _.forEach(_.forEach(data.split(" ").slice(0),
//         function (word) {
//             return [word, crypto.createHash('sha1').update(word).digest('hex')];
//         }
//     ).sort(function (x, y) {
//         return x[1] > y[1];
//     }), function (x) {
//         return x[0];
//     }).join(' < '));

// };

// var defaults = {
//     description: {
//         pl: ",pick [str1] [str2]...- Wyświetla posortowaną listę.",
//         en: ",pick [str1] [str2]...- Shows sorted list.."
//     },
//     aliases: [
//         "choose"
//     ]
// };


// module.exports = {
//     method: method,
//     defaults: defaults
// };