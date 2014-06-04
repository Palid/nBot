"use strict";
var vm = require('vm');
var _ = require('lodash');

var context = {};

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
    var ctx, script, response;

    ctx = vm.createContext(context);


    try {
        script = vm.createScript(data, null, true);
        response = script.runInNewContext(ctx);
        if (_.isArray(response)) {
            var map = _.map(response, function (item) {
                return String(item).replace(/[\r\n]/g, '').trim();
            });
            process.send(map);
        } else {
            process.send(String(response).replace(/[\r\n]/g, '').trim());
        }
    } catch (err) {
        console.log(err);
        process.send("Error: " + err.message);
    }

});