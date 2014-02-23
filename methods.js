/*jslint node: true */
"use strict";
var fs = require('fs'),
    _ = require('lodash');

var methods = {};
var methodsDir = fs.readdirSync('methods', 'utf-8');

_.forEach(methodsDir, function (data, index) {
    console.log(data);

    var fileName = function () {
        var a = data.split('.');
        return a[0];
    };
    var fn = fileName();

    methods[fn] = require('./methods/' + data);
});

console.log(methods);

// var methods = {
//     topic: function (channel, topic) {
//         client.say(channel + ' topic changed to ' + topic);
//         return client.send("TOPIC", channel, topic);
//     },
//     kick: function (channel, data, commandGiver) {

//         var firstWhitespace = _.indexOf(data, ' '),
//             nick = data.substring(0, firstWhitespace),
//             body = data.substring(firstWhitespace + 1);

//         console.log(nick);

//         if (nick === "chomis" || body === "chomis") {

//             return client.send("KICK", channel, commandGiver, "Czemu chcesz wykopać chomika? ;_;");
//         } else {
//             return client.send("KICK", channel, nick, body);
//         }
//     },
//     say: function (channel, data) {
//         return client.say(channel, data);
//     },
//     shout: function (channel, data) {
//         return client.say(channel, data.toUpperCase());
//     },
//     google: function (channel, data) {
//         // Links amount to display
//         // per search
//         google.resultsPerPage = 1;

//         google(data, function (err, next, links) {
//             if (err) console.error(err);

//             var length = links.length;

//             for (var i = 0; i < length; ++i) {
//                 var title = links[i].title.substring(0, 100) + "...",
//                     link = links[i].link,
//                     description = links[i].description.substring(0, 200) + "...",
//                     searchResult = "";

//                 if (_.isString(link)) searchResult += link + " --- ";

//                 if (_.isString(title)) searchResult += title + " ";

//                 if (_.isString(description)) searchResult += "\r\n" + description;

//                 console.log(searchResult);

//                 client.say(channel, searchResult);

//             }

//         });
//     },
//     list: function (channel, data) {
//         var list = "";

//         for (var property in data) {

//             list = list + (client.commandCharacter + property + " ");
//         }

//         return client.say(channel, list);
//     },
//     evaluate: function (channel, evaluation) {

//         var arr = [],
//             worker = cluster.fork();
//         arr[0] = channel;
//         arr[1] = evaluation;

//         client.say(channel, "Trying to evaluate " + evaluation);

//         worker.send(arr);
//     },
//     msg: function (channel, data) {

//         if (data.substring(0, 1) !== '#') {

//             var firstWhitespace = _.indexOf(data, ' '),
//                 nick = data.substring(0, firstWhitespace),
//                 body = data.substring(firstWhitespace + 1);

//             return client.say(nick, body);
//         }
//         return client.say(channel, "Couldn't send text message.");
//     },
//     dice: function (channel, data) {

//         var firstWhitespace = _.indexOf(data, ' '),
//             d = _.indexOf(data, 'd'),
//             diceThrows = parseInt(data.substring(firstWhitespace, d), 10),
//             dices = parseInt(data.substring(d + 1, data.length), 10),
//             finalResult = null,
//             resultsList = "";

//         if (!_.isNaN(dices) && !_.isNaN(diceThrows)) {
//             console.log(_.isNumber(dices));
//             console.log(_.isNumber(diceThrows));

//             for (var i = 0; i < diceThrows; i++) {
//                 var x = Math.floor(Math.random() * dices + 1);
//                 finalResult += x;
//                 resultsList += x.toString() + ", ";
//             }

//             return client.say(channel, "Throw results for " + data + ": " + resultsList + "with final result of: " + finalResult);
//         } else {
//             return client.say(channel, "Throw result is not a number. Example of valid dice throw: 2d10");

//         }

//     },
//     invite: function (channel, data) {
//         console.log(channel);
//         console.log(data);
//         return client.send("INVITE", data, channel);
//     }

//     // TODO:
//     // Create serious aliases system
//     // because this thing is a BIG SHIT at the moment.
//     // IT REALLY IS SHITTY.
//     // REALLY.
//     // TODO:
//     // ban
// };

module.exports = methods;