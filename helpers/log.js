"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path');

/**
 * @private timestamp  Creates timestamps bases on delimiter options
 * @param {Object} characters Characters object
 * @property {String} date Character(s) used for splitting date string
 * @property {String} time Chracter(s) used for splitting time string
 * @property {String} start Character(s) used at beginning of the string
 * @property {String} end Character(s) used for ending of the string
 * @return {Object} Returns object with date and time
 */
function timeStamp(characters) {
    if (!_.isObject(characters)) characters = {};
    if (!characters.date) characters.date = '.';
    if (!characters.time) characters.time = ':';
    if (!characters.start) characters.start = '[';
    if (!characters.end) characters.end = ']';

    var currentTime = new Date(),
        year = currentTime.getUTCFullYear(),
        month = currentTime.getUTCMonth() + 1, //month counting starts at 0
        day = currentTime.getUTCDate(),
        hours = currentTime.getHours(),
        minutes = currentTime.getMinutes(),
        seconds = currentTime.getSeconds();

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    var date = [
        characters.start,
        day,
        characters.date,
        month,
        characters.date,
        year,
        characters.end
    ];

    var time = [
        characters.start,
        hours,
        characters.time,
        minutes,
        characters.time,
        seconds,
        characters.end
    ];

    return {
        date: date.join(''),
        time: time.join('')
    };
}

/**
 * @public logger  Saves human-readable strings to file
 * @param  {Object} options Options object
 * @property {Object || Boolean} timeStamp timeStamp object
 * - {String} delimiter Character(s) used for splitting time and date string
 * - {String} date Character(s) used for splitting date string
 * - {String} time Chracter(s) used for splitting time string
 * - {String} start Character(s) used at beginning of the string
 * - {String} end Character(s) used for ending of the string
 * @property {String} fileName File name or destination to which log
 *                             will be saved
 * @property {String} data Data that should be saved
 */
var method = function logger(options) {
    if (!options) {
        console.error("Options for logger were not specified!");
        options = {};
    }
    var dir = path.resolve(__dirname, "../logs/" + options.fileName + ".log");
    if (options.timeStamp) {
        if (!options.timeStamp.delimiter) options.timeStamp.delimiter = " ";
        var dateTime = timeStamp(options.timeStamp);
        options.data = [
            dateTime.date,
            dateTime.time,
            options.timeStamp.delimiter,
            options.data
        ].join('');
    }
    fs.appendFile(dir, options.data, function (err) {
        if (err) console.log(err);
    });


};

module.exports = method;