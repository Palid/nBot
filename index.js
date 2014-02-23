/*jslint node: true */
var fs = require('fs'),
    _ = require('lodash'),
    methods = require('./methods/'),
    configDir = './config/aliases.json';


var initialize = function (data) {

    for (property in methods) {

        if (!_.has(parsed, property)) {
            console.log("Nima :(");
            parsed[property] = {
                aliases: methods[property].defaults.aliases,
                description: methods[property].defaults.description
            };
        }
    }

    var stringify = JSON.stringify(parsed, null, 4);

    fs.writeFile(configDir, stringify, function (err) {
        if (err) throw err;
    });
};

var createList = function (data) {
    var aliasesList = {};

    var collection = _.mapValues(data, function (el) {
        return el.aliases;
    });

    for (property in collection) {

        aliasesList[property] = methods[property].method;

        for (var i = 0, len = collection[property].length; i < len; i++) {
            aliasesList[collection[property][i]] = methods[property].method;
        }
    }
    return aliasesList;
};

var checkIfExists = function (dir) {

    if (fs.existsSync(dir)) {
        var aliases = fs.readFileSync(dir, 'utf8'),
            parsed = JSON.parse(aliases);

        return parsed;
    } else {
        return {};
    }
};

var parsed = checkIfExists(configDir),
    aliasList = (_.isNull(parsed)) ? {} : createList(parsed);

initialize(parsed);


module.exports = aliasList;