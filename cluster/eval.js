/*jslint node: true */
"use strict";

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {

    var vm = require('vm');

    var context = {
        math: Math
    },
        ctx = vm.createContext(context),
        script = vm.createScript(data);

    var response = script.runInNewContext(ctx);

    process.send(response); //Send the finished message to the parent process

});