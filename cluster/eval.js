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
        process.send(response);
    } else if (_.isFunction(response)) {
        process.send(response.toString());
    } else if (!process) {
        process.send(false);
    }

    process.send(response); //Send the finished message to the parent process

});