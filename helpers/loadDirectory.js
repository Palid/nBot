"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    events = require('./events.js');

/**
 * loadDirectory loads whole directory as an object and exports it from module
 * @param  {String} fileList      List of all files(and directories) from current dir
 * @param  {String} dir Resolved path from which files will be required
 * @param  {Object} options  Options object
 * - {Regexp} re            Regexp to match for files
 * - {Number} maxDepth      Maximum depth for recursive file loads
 * - {String} type          File type/extension
 * - {Boolean} goDeeper      Defines if function should go to another nested dir
 * @return {Object}          Returns a dictionary of all required files.
 */
function loadDirectory(fileList, dir, options) {
    var pending = fileList.length;

    _.forEach(fileList, function (file) {
        var fileDir = dir + '/' + file;
        var stat = fs.lstatSync(fileDir);
        if (stat && stat.isDirectory() && options.recursive) {
            loadDirectory(fs.readdirSync(fileDir), fileDir, options);
        } else {
            if (!_.isNull(file.match(options.re)) && file !== 'index.js' && file !== "package.json") {
                var name = file.replace(options.type, '');
                options.results.push({
                    directory: fileDir,
                    name: name
                });
            }
        }
    });

    if (options.results.length >= pending) {
        var resultsMap = {};
        _.forEach(options.results, function (property) {
            resultsMap[property.name] = require(property.directory);
        });
        if (options.event) events.emit(options.event, resultsMap);
        return resultsMap;
    }
}


/**
 * prepareFunction prepares request for the directory loading.
 * @param  {String}     destinationDir  Relative path to the directory to load
 * @param  {Options}    required        Options object
 * -       {String}     type            File extension to load
 * -       {String}     currentDir      __dirname
 * -       {Number}     maxDepth        Maximum nested depth to load from
 * -       {Boolean}    flat            Decides if the returned structure is flat
 * -       {String}     event           Event to emit after loading's finished
 * @return {function}   Callbacks helper function, loadDirectory
 */
function prepareFunction(destinationDir, required) {
    if (!required.type) throw "You didn't specify file type/extension!";
    if (!required.currentDir || !destinationDir) {
        throw "You didn't specify directories in loadDirectory!";
    }

    var re = new RegExp(".+" + [required.type], "g"),
        dir = path.resolve(required.currentDir, destinationDir),
        fileList = fs.readdirSync(dir);

    return loadDirectory(fileList, dir, {
        type: required.type,
        recursive: required.recursive,
        event: required.event,
        re: re,
        results: [],
    });

}
module.exports = prepareFunction;