"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    methods = require('../api/'),
    config = require('./parseJSON.js'),
    hotLoad = require('../privateMethods/hotload.js'),
    watch = require('./watch.js');


watch.on('configChanged', function () {
    config = hotLoad(__dirname, './parseJSON.js');
});


var createList = function (data) {
    var aliasesList = {},
        property;

    var collection = _.mapValues(data, function (data) {
        return data.aliases;
    });

    for (property in collection) {

        aliasesList[property] = methods[property].method;

        for (var i = 0, len = collection[property].length; i < len; i++) {
            /**
             * I'm not really sure if returning method is better than just
             * defining it to the dictionary. Need to benchmark this stuff.
             */
            aliasesList[collection[property][i]] = methods[property].method;

        }
    }

    return aliasesList;
};


console.log("Creating aliases dictionary");



module.exports = createList(config);