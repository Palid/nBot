"use strict";
var _ = require('lodash'),
    cluster = require('cluster'),
    client = require('../config/bot.js');

cluster.setupMaster({
    exec: "cluster/eval.js",
    args: process.argv.slice(2),
    silent: false
});


var method = function (channel, evaluation) {

    //This will be fired when the forked process becomes online
    cluster.on("online", function (worker) {

        worker.on("message", function (evaledString) {

            clearTimeout(timer); //The worker responded in under 5 seconds, 
            // clear the timeout
            worker.destroy(); //Don't leave him hanging 
            cluster.removeAllListeners();

            if (_.isNull(evaledString)) {
                return {
                    type: "say",
                    to: channel,
                    message: "null"
                };
            } else if (_.isUndefined(evaledString)) {
                return {
                    type: "say",
                    to: channel,
                    message: "undefined"
                };
            } else {
                return {
                    type: "say",
                    to: channel,
                    message: evaledString
                };
            }

        });


        var timer = setTimeout(function () {
            cluster.removeAllListeners();
            worker.destroy();
            return {
                type: "say",
                to: channel,
                message: "undefined"
            };
        }, 200);

    });

    var worker = cluster.fork();

    worker.send(evaluation);
};

var defaults = {
    description: {
        pl: ",eval [argumenty] - Ewaluuje wyrażenie. Dostępny JSowy obiekt Math.",
        en: ",eval [arguments] - Evaluates the expression. Object Math is allowed."
    },
    aliases: [
        'maths',
        'math',
        'evaluate',
        'e',
        'count'
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};