"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    methods = require('../publicMethods/');
// config = require('./parseJSON.js');

var createList = function (data) {
    var aliasesList = {};

    var collection = _.mapValues(data, function (data) {
        return data.aliases;
    });

    for (var property in collection) {

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

module.exports = createList;