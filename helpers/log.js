"use strict";
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    makeDirs = require('../helpers/makeDirs.js');

makeDirs({
    logs: 'logs',
    users: 'logs/users',
    urls: 'logs/urls',
    channels: 'logs/channels'
});

var method = function (options) {

    var timestampBool = options.timeStamp,
        name = options.fileName,
        data = options.data;

    function timestamp() {

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



        var date = "[" + day + '.' + month + '.' + year + "]";
        var time = "[" + hours + ":" + minutes + ":" + seconds + "]";

        return date + time;
    }

    var time = timestamp(),
        dir = path.resolve(__dirname, "../logs/" + name + ".log"),
        logString = (timestampBool) ? time + " " + data : data;

    fs.appendFile(dir, logString, function (err) {
        if (err) console.log(err);
    });
};

module.exports = method;