/*jslint node: true */
'use strict';
var _ = require('lodash'),
    fs = require('fs'),
    dir = fs.readdirSync(__dirname + '/');

// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
_.forEach(dir, function (file) {
    if (!_.isNull(file.match(/.+\.js/g)) && file !== 'index.js' && file !== "package.json") {
        var name = file.replace('.js', '');
        exports[name] = require('./' + file);
    }
});