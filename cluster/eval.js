"use strict";
var _ = require('lodash'),
    vm = require('vm');

var context = {
    math: Math
};

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
    var ctx, script, response;

    ctx = vm.createContext(context);


    try {
        script = vm.createScript(data, null, true);
        response = script.runInNewContext(ctx);

        if (_.isString(response)) {
            process.send(response.replace(/[\r\n]/g, '').trim());
        } else if (_.isFunction(response)) {
            process.send(response.toString());
        } else if ((_.isArray(response))) {
            process.send(response.join(""));
        } else if (_.isNaN(response)) {
            process.send("NaN");
        } else if (!_.isFinite(response)) {
            process.send("Infinity");
        } else if (_.isNumber(response)) {
            process.send(response.toString());
        } else if (!process) {
            process.send(false);
        }

    } catch (err) {
        console.log(err);
        process.send("Error: " + err.message);
    }

});