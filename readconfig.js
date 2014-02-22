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


        var test = _.pick(parsed, {});

        console.log(test);


        // _.forEach(parsed, function (alias) {
        //     _.forEach(alias.aliases, function (row) {
        //         // console.log(row);
        //         aliasesList[row] = prop.toString();
        //         console.log(aliasesList[row]);
        //     });
        //     // aliasesList[alias] = [];
        //     // aliasesList[alias].push.apply(aliasesList, alias.aliases);
        //     // console.log(aliasesList[alias]);
        // });

        // if (_.isFunction(callback)) {
        //     callback();
        // }

    });
}

function exportModule() {
    console.log(aliasesList);
    module.exports = aliasesList;
}

readConfig(exportModule);