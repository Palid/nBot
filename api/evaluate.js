"use strict";
var cluster = require('cluster'),
    events = require('../helpers/events.js');

cluster.setupMaster({
    exec: "cluster/eval.js",
    args: process.argv.slice(2),
    silent: false
});

var method = function evaluate(options) {

    //This will be fired when the forked process becomes online
    cluster.once("online", function (worker) {

        worker.once("message", function (evaledString) {

            clearTimeout(timer);
            worker.destroy();
            events.emit('apiSay', options.to, evaledString);

        });


        var timer = setTimeout(function () {
            cluster.removeAllListeners();
            worker.destroy();
            events.emit('apiSay', options.to, "Execution timed out.");
        }, 2000);

    });

    var worker = cluster.fork();

    worker.send(options.message);

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