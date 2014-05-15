"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    events = require('./events.js');

/**
 * loadDirectory loads whole directory as an object and exports it from module
 * @param  {String} dir      Synchronically read directory
 * @param  {String} resolved Resolved path from which files will be required
 * @param  {Object} options  Options object
 * - {Regexp} type           Chosen files extension
 * - {Number} maxDepth       Maximum depth for recursive file loads
 * @return {Object}          Returns a dictionary of all required files.
 */
function loadDirectory(dir, resolved, options) {
    for (var i = 0, len = dir.length; i < len; i++) {
        var file = dir[i],
            currentFileDirectory = path.resolve(resolved, file),
            isDir = fs.lstatSync(currentFileDirectory).isDirectory();
        if (!isDir) {
            if (!_.isNull(file.match(options.re)) && file !== 'index.js' && file !== "package.json") {
                var name = file.replace(options.type, '');
                if (options.goDeeper) {
                    var deepDir = path.basename(resolved);
                    if (!_.isObject(options.data[deepDir])) options.data[deepDir] = {};
                    options.data[deepDir][name] = require(currentFileDirectory);
                } else {
                    options.data[name] = require(currentFileDirectory);
                }
            }
        } else {
            if (options.iterator < options.maxDepth) {
                loadDirectory(fs.readdirSync(currentFileDirectory), currentFileDirectory, {
                    re: options.re,
                    maxDepth: options.maxDepth,
                    goDeeper: true,
                    data: options.data
                });
                options.iterator++;
            }
        }
    }
    if (options.event) events.emit(options.event, options.data);
    return options.data;
}


/**
 * [prepareFunction description]
 * @param  {[type]} destinationDir [description]
 * @param  {[type]} required       [description]
 * @return {[type]}                [description]
 */
function prepareFunction(destinationDir, required) {
    if (!required.type) throw "You didn't specify file type/extension!";
    if (!required.currentDir || !destinationDir) {
        throw "You didn't specify directories in loadDirectory!";
    }

    var re = new RegExp(".+" + [required.type], "g"),
        resolved = path.resolve(required.currentDir, destinationDir),
        dir = fs.readdirSync(resolved);

    return loadDirectory(dir, resolved, {
        type: required.type,
        re: re,
        maxDepth: required.maxDepth,
        data: {},
        iterator: 0,
        event: required.event

    });

}
module.exports = prepareFunction;