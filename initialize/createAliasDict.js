"use strict";
var _ = require('lodash'),
    methods = require('../api/'),
    hotLoad = require('../helpers/hotload.js'),
    watch = require('../events/watch.js'),
    config = hotLoad(__dirname, './parseJSON.js');


watch.on('configChanged', function () {
    config = hotLoad(__dirname, './parseJSON.js');
});

/**
 * [createList description]
 * Creates a dictionary with all possible aliases of functions.
 * @param  {Object} data
 * @return {Object}
 */
var createList = function createList(data) {
    var aliasesList = {},
        aliasDict = _.mapValues(data, function (property) {
            return property.aliases;
        });

    _.forEach(aliasDict, function (property, key) {
        var selfKey = key;
        aliasesList[key] = methods[key].method;

        _.forEach(aliasDict[key], function (property) {
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