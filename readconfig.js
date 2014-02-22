/*jslint node: true */
var _ = require('lodash'),
    fs = require('fs');

var aliasesList = {};

function readConfig(callback) {
    fs.readFile('./aliases.json', 'utf8', function (err, data) {

        if (err) {
            console.log('Error: ' + err);
            return;
        }

        //    .     _///_,
        //   .      / ` ' '>
        //     )   o'  __/_'>
        //    (   /  _/  )_\'>
        //     ' "__/   /_/\_>
        //         ____/_/_/_/
        //        /,---, _/ /
        //       ""  /_/_/_/
        //          /_(_(_(_                 \
        //         (   \_\_\\_               )\
        //          \'__\_\_\_\__            ).\
        //          //____|___\__)           )_/
        //          |  _  \'___'_(           /'
        //           \_ (-'\'___'_\      __,'_'
        //           __) \  \\___(_   __/.__,'
        // b'ger  ,((,-,__\  '", __\_/. __,'
        //                     '"./_._._-'

        // HERE BE DRAGONS


        parsed = JSON.parse(data);


        _.forEach(parsed, function (element, index, collection) {
            // console.log(element);
            // aliasesList[element] = [];
            // aliasesList[element].push(element);
            // _.forEach(element, function (subAlias) {
            //     aliasesList[subAlias] = element;
            // });
            // console.log(element);
            // console.log(index);
            // console.log(parsed[index]);
            aliasesList[element] = collection[index];

        });
        console.log(aliasesList);
        // console.log(aliasesList);
        // _.forEach(aliasesList, function (alias) {
        //     console.log(alias);
        // });
    });
}

function exportModule() {
    console.log(aliasesList);
    module.exports = aliasesList;
}

readConfig(exportModule);