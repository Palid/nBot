'use strict';
var vm = require('vm');

//The runner.js is ran in a separate process and just listens for the message which contains code to be executed
process.on('message', function clusterData(data) {
  var ctx, response, parsed;

  ctx = vm.createContext({});


  try {
    response = vm.runInNewContext(data, ctx);
    if (Array.isArray(response)) {
      var map = response.map(function(item) {
        return String(item).replace(/[\r\n]/g, '').trim();
      });
      process.send(JSON.stringify(response));
    } else if (typeof response === 'object'){
      try {
        process.send(JSON.stringify(response).replace(/[\r\n]/g, '').replace(/"/g, '').trim());
      } catch (e) {
        console.log(e.stack);
        process.send('Error: ' + e.message);
      }
    } else {
      process.send(String(response).replace(/[\r\n]/g, '').trim());
    }
  } catch (err) {
    console.log(err.stack);
    process.send('Error: ' + err.message);
  }
});
