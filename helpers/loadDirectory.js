"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    events = require('./events.js');

var walk = function (dir, done) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        var pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(function (file) {
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
/**
 * loadDirectory loads whole directory as an object and exports it from module
 * @param  {String} dir      Synchronically read directory
 * @param  {String} resolved Resolved path from which files will be required
 * @param  {Object} options  Options object
 * - {Regexp} re            Regexp to match for files
 * - {Number} maxDepth      Maximum depth for recursive file loads
 * - {String} type          File type/extension
 * - {Boolean} goDeeper      Defines if function should go to another nested dir
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
            // TODO
            ////////////////////
            // REAL MAXDEPTH. //
            //////////////////////
            // It's broken ATM. //
            //////////////////////
            // if (_.find(options.directories, function (dirName) {
            //     return dirName === currentFileDirectory;
            // })) {
            //     options.directories.currentDepth++;
            // } else {
            //     options.directories.push({
            //         directory: currentFileDirectory,
            //         currentDepth: 1
            //     });
            // }
            if (options.iterator <= options.maxDepth) {
                loadDirectory(fs.readdirSync(currentFileDirectory), currentFileDirectory, {
                    re: options.re,
                    maxDepth: options.maxDepth,
                    goDeeper: true,
                    data: options.data,
                    type: options.type
                });
                options.iterator++;
            }
        }
    }
    if (options.flat) {
        _.forEach(options.data, function (property) {
            options.data = _.merge(property);
        });
    }
    if (options.event) events.emit(options.event, options.data);
    return options.data;
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
        resolved = path.resolve(required.currentDir, destinationDir),
        dir = fs.readdirSync(resolved);

    return loadDirectory(dir, resolved, {
        type: required.type,
        re: re,
        maxDepth: required.maxDepth,
        flat: required.flat,
        data: {},
        iterator: 0,
        event: required.event
        // TODO
        // REAL MAXDEPTH
        // directories: []
    });

}
module.exports = prepareFunction;