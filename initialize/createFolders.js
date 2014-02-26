'use strict';
var fs = require('fs'),
    _ = require('lodash'),
    path = require('path');


//Create logs directory

if (fs.existsSync(path.resolve(__dirname, "../logs"))) {
    console.log("Logs directory exists, not creating");
} else {
    console.log("Creating logs directory");
    fs.mkdirSync(path.resolve(__dirname, "../logs"));
}

//Create pids directory for forever

if (fs.existsSync(path.resolve(__dirname, "../pids"))) {
    console.log("Pids directory exists, not creating");
} else {
    console.log("Creating Pids directory");
    fs.mkdirSync(path.resolve(__dirname, "../pids"));
}