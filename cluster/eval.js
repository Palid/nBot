"use strict";

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
    data = data.trim();

    var evalString, evalFunc;
    evalString = data.search('eval');
    evalFunc = data.search('eval\\(');

    while (evalString !== -1 && evalFunc === -1) {
        data = data.replace('eval', 'eval()');
        evalString = data.search('eval');
        evalFunc = data.search('eval\\(');
    }

    var vm = require('vm');

    var context = {
        math: Math
    },
        ctx = vm.createContext(context),
        script = vm.createScript(data),
        response;

    response = script.runInNewContext(ctx);

    process.send(response); //Send the finished message to the parent process

});