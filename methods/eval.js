/*jslint node: true */
"use strict";
var _ = require('lodash'),
    irc = require('irc'),
    cluster = require('cluster'),
    client = require('../config/bot.js');

cluster.setupMaster({
    exec: "../cluster/eval.js",
    args: process.argv.slice(2),
    silent: false
});

var method = function (channel, evaluation) {

    //This will be fired when the forked process becomes online
    cluster.on("online", function (worker) {

        worker.on("message", function (evaledString) {

            clearTimeout(timer); //The worker responded in under 5 seconds, clear the timeout
            worker.destroy(); //Don't leave him hanging 
            cluster.removeListener('online'); // Remove listener from cluster

            if (_.isNull(evaledString)) {
                return client.say(channel, "null");
            } else if (_.isUndefined(evaledString)) {
                return client.say(channel, "undefined");
            } else {
                return client.say(channel, evaledString);
            }

        });


        var timer = setTimeout(function () {
            worker.destroy();
            cluster.removeListener('online'); // Remove listener from cluster
            return client.say(channel, "undefined");
        }, 10);

    });

    var worker = cluster.fork();

    worker.send(evaluation);
};

var defaults = {
    description: {
        pl: "Wyświetla listę komend.",
        eng: "Lists all commands."
    },
    aliases: [
        "help",
        "commands"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};