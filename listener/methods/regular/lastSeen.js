"use strict";
var path = require('path'),
    _ = require('lodash'),
    rootDir = path.dirname(require.main.filename),
    db = require(rootDir + '/core/initialize/database/index.js');

var method = function usersLog(from, to, message) {
    var data = db.get("channelUser", {
        from: from,
        to: to
    });
    if (!_.isObject(data)) {
        db.set("seenCreate", {
            from: from,
            to: to
        });
    }
    db.set("seen", {
        from: from,
        to: to
    });


};



module.exports = method;