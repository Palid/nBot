"use strict";
var _ = require('lodash');

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
    var vm = require('vm');

    var context = {
        math: Math
    },
        ctx = vm.createContext(context),
        script = vm.createScript(data, null, true),
        response;

    response = script.runInNewContext(ctx);

    if (_.isString(response)) {
        process.send(response.replace(/[\r\n]/g, '').trim());
    } else if (_.isFunction(response)) {
        process.send(response.toString());
    } else if (_.isArray(response)) {
        process.send(response.join(""));
    } else if (_.isObject(response)) {
        process.send(JSON.stringify(response));
    } else if (_.isNaN(response)) {
        process.send("NaN");
    } else if (!process) {
        process.send(false);
    }

    process.send(response); //Send the finished message to the parent process

});