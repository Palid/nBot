'use strict';
var vm = require('vm');
var fs = require('fs');
var path = require('path');

var lodash = fs.readFileSync(path.join(__dirname, './__lodash.js'));
var moment = fs.readFileSync(path.join(__dirname, './__moment.js'));


process.on('message', function clusterData(data) {
  var ctx, response, parsed;

  ctx = vm.createContext(null);

  var extendedDataWithLibraries = `;${lodash};${moment};${data}`;

  try {
    response = vm.runInNewContext(extendedDataWithLibraries, ctx);
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
