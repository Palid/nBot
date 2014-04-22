"use strict";
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

var RE = {
    js: {
        regex: new RegExp(/.+\.js/g),
        replace: {
            from: '.js',
            to: ''
        }
    },
    json: {
        regex: new RegExp(/.+\.json/g),
        replace: {
            from: '.json',
            to: ''
        }
    },
    log: {
        regex: new RegExp(/.+\.log/g),
        replace: {
            from: '.log',
            to: ''
        }
    },
};

function loadDirectory(dir, resolved, options) {
    for (var i = 0, len = dir.length; i < len; i++) {
        var file = dir[i],
            currentFileDirectory = path.resolve(resolved, file),
            isDir = fs.lstatSync(currentFileDirectory).isDirectory();
        if (!isDir) {
            if (!_.isNull(file.match(options.re.regex)) && file !== 'index.js' && file !== "package.json") {
                var name = file.replace(options.re.replace.from, options.re.replace.to);
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
    return options.data;
}

function prepareFunction(destinationDir, required) {
    if (!required.type) required.type = 'js';
    if (!required.currentDir || !destinationDir) {
        throw "You didn't specify directories in loadDirectory!";
    }
    var re = RE[required.type],
        resolved = path.resolve(required.currentDir, destinationDir),
        dir = fs.readdirSync(resolved);

    return loadDirectory(dir, resolved, {
        re: re,
        maxDepth: required.maxDepth,
        data: {},
        iterator: 0

    });

}
module.exports = prepareFunction;