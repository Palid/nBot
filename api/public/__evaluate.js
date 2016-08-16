'use strict';
var vm = require('vm');
var _ = require('lodash');

var context = {};
//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
  var ctx, response;

  ctx = vm.createContext(context);


  try {
    response = vm.runInNewContext(data, ctx);
    if (_.isArray(response)) {
      var map = _.map(response, function(item) {
        return String(item).replace(/[\r\n]/g, '').trim();
      });
      process.send(map);
    } else {
      process.send(String(response).replace(/[\r\n]/g, '').trim());
    }
  } catch (err) {
    console.log(err.stack);
    process.send('Error: ' + err.message);
  }
});
