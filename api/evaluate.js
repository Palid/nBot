"use strict";
var _ = require('lodash'),
    cluster = require('cluster'),
    client = require('../config/bot.js');

cluster.setupMaster({
    exec: "cluster/eval.js",
    args: process.argv.slice(2),
    silent: false
});


var method = function evaluate(options) {

    var channel = options.to,
        evaluation = options.message;

    //This will be fired when the forked process becomes online
    cluster.on("online", function (worker) {

        worker.on("message", function (evaledString) {
            var stringToSay = evaledString.toString().replace(/[\r\n]/g, '');

            clearTimeout(timer); //The worker responded in under 5 seconds,
            // clear the timeout
            worker.destroy(); //Don't leave him hanging
            cluster.removeAllListeners();

            if (!evaledString) {
                client.say(channel, "null");
            } else {
                client.say(channel, stringToSay);
            }

        });


        var timer = setTimeout(function () {
            cluster.removeAllListeners();
            worker.destroy();
            client.say(channel, "null");
        }, 200);

    });

    var worker = cluster.fork();

    worker.send(evaluation);

    return {
        type: "async"
    };
};

var defaults = {
    description: {
        pl: ",eval [argumenty] - Ewaluuje wyrażenie. Dostępny JSowy obiekt Math.",
        en: ",eval [arguments] - Evaluates the expression. Object Math is allowed."
    },
    aliases: [
        'maths',
        'math',
        'eval',
        'e',
        'count'
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};