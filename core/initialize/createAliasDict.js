"use strict";
var _ = require('lodash'),
    methods = require('../../api/'),
    events = require('../events.js'),
    config = require('./parseJSON.js');

/**
 * [createList description]
 * Creates a dictionary with all possible aliases of functions.
 * @param  {Object} data
 * @return {Object}
 */
var createList = function createList(data) {
    var aliasesList = {},
        aliasDict = _.mapValues(data, function (property) {
            return {
                alias: property.aliases,
                level: property.level || 0
            };
        });

    _.forEach(aliasDict, function (property, key) {
        var selfKey = key;
        aliasesList[key] = {
            method: methods[key].method,
            level: methods[key].defaults.level || 0
        };

        _.forEach(aliasDict[key].alias, function (property) {
            aliasesList[_.isObject(property) ? property.alias : property] = {
                method: methods[selfKey].method,
                level: methods[selfKey].defaults.level || 0,
                options: property.options || undefined
            };
        });
    });
    return aliasesList;
};


console.log("Creating aliases dictionary");



module.exports = createList(config);