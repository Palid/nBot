var irc = require('irc'),
    client = require('./config.js');
//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function( arr ) {

    var vm = require("vm");

    console.log(arr);
    // console.log(channel);
    // console.log(stringy);

    var obj = {},
    channel = arr[0],
    evaluation = arr[1],
    ctx = vm.createContext(obj),
    script = vm.createScript(arr[1]);

    console.log(channel);
    console.log(evaluation);

    // console.log(script.runInNewContext(ctx));

    var asd = function (){
        return script.runInNewContext(ctx);
    };

    client.say(arr[0], asd());


    process.on('uncaughtException', function (err) {
      process.send( "finished" ); //Send the finished message to the parent process
    });

    process.send( "finished" ); //Send the finished message to the parent process

});