"use strict";
var path = require('path'),
    watch = require('../initialize/watch.js');


// var pars = parsed(config),
//     jsonFile = createJSON(pars),
//     dict = aliasesDict(pars);
// function getParsed() {
//     return pars;
// }

// function getAliases() {
//     return dict;
// }

var dir = function (dir) {
    return dir;
};

function method(dir) {
    delete require.cache[path.resolve(__dirname, dir)];
    return require(dir);
}

watch.on('configChanged', method(dir));




module.exports = dir;