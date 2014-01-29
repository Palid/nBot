"use strict";
var _ = require('lodash');
//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function( arr ) {

    var vm = require('vm');

    var obj = {},
    channel = arr[0],
    evaluation = arr[1],
    ctx = vm.createContext(obj),
    script = vm.createScript(arr[1]);

    arr[1] = script.runInNewContext(ctx);
    console.log(arr[1]);


    process.send( arr ); //Send the finished message to the parent process

});