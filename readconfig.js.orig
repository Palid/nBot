/*jslint node: true */
var _ = require('lodash'),
    fs = require('fs');

var parseConfig = function (data) {
    var parsed = JSON.parse(data),
        aliasesList = {};

    var collection = _.mapValues(parsed, function (el) {
        return el.aliases;
    });

    for (property in collection) {

        for (var i = 0, len = collection[property].length; i < len; i++) {
            aliasesList[collection[property][i]] = property;
        }
        aliasesList[property] = property;
    }
    return aliasesList;

};

var readFile = fs.readFile('./aliases.json', 'utf8', function (err, data) {

    if (err) {
        console.log('Error: ' + err);
        return;
    }

    module.exports = parseConfig(data);


});