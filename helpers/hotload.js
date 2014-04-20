"use strict";
var _ = require('lodash'),
    path = require('path'),
    methods = {};

function method(dirname, dir) {
    var modulePath = path.resolve(dirname, dir),
        time;

    if (methods[modulePath]) {
        methods[modulePath].watchTime = Date.now();
    } else {
        methods[modulePath] = {
            watchTime: Date.now()
        };
    }
    time = methods[modulePath].lastChangeTime ?
        methods[modulePath].watchTime - methods[modulePath].lastChangeTime :
        0;

    if (!methods[modulePath].lastChangeTime || time > 5000) {
        methods[modulePath].lastChangeTime = Date.now();
    }

    if (time > 0 && time <= 5000 && methods[modulePath].method) {
        return methods[modulePath].method;
    } else {
        delete require.cache[modulePath];
        methods[modulePath].method = require(modulePath);
        return methods[modulePath].method;
    }

}


module.exports = method;