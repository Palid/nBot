  var path = require('path')
    , winstonConf = require('winston-config');

  winstonConf.fromFile(path.join(__dirname, '../config/example-winston-config.json'), callback(error, winston) {
    if (error) {
      console.log('error during winston configuration');
    } else {
      console.log('everything alright');
    }
  });