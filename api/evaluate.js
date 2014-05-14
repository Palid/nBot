"use strict";
var cluster = require('cluster'),
    events = require('../helpers/events.js');

cluster.setupMaster({
    exec: "cluster/eval.js",
    args: process.argv.slice(2),
    silent: false
});

var method = function evaluate(options) {

    var channel = options.to,
        evaluation = options.message;

    //This will be fired when the forked process becomes online
    cluster.once("online", function (worker) {

        worker.once("message", function (evaledString) {
            var stringToSay = evaledString ? evaledString.toString().replace(/[\r\n]/g, '') : null;

            clearTimeout(timer);
            worker.destroy();

            if (!evaledString) {
                events.emit('apiResponse', channel, "null");
            } else {
                events.emit('apiResponse', channel, stringToSay);
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