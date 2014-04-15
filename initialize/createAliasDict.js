"use strict";
var fs = require('fs'),
    _ = require('lodash'),
    methods = require('../api/'),
    config = require('./parseJSON.js'),
    hotLoad = require('../helpers/hotload.js'),
    watch = require('./watch.js');


watch.on('configChanged', function () {
    config = hotLoad(__dirname, './parseJSON.js');
});

var createList = function (data) {
    var aliasesList = {},
        property;

    var aliasDict = _.mapValues(data, function (property) {
        return property.aliases;
    });

    _.forEach(aliasDict, function (property, key) {
        var selfKey = key;
        aliasesList[key] = methods[key].method;

        _.forEach(aliasDict[key], function (property, key) {
            if (_.isObject(property)) {
                aliasesList[property.alias] = {
                    method: methods[selfKey].method,
                    options: property.options
                };
            } else {
                aliasesList[property] = methods[selfKey].method;
            }
        });
    });

    console.log(aliasesList);
    return aliasesList;
};


console.log("Creating aliases dictionary");



module.exports = createList(config);