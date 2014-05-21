"use strict";
var fs = require('fs'),
    path = require('path'),
    config = path.resolve(__dirname, "../../database/aliases.json");

var method = function (dir) {

    if (fs.existsSync(dir)) {
        var aliases = fs.readFileSync(dir, 'utf8'),
            parsed;
        try {
            parsed = JSON.parse(aliases);
            return parsed;
        } catch (err) {
            console.log(err);
            fs.writeFileSync(dir, "{}");
        }
        return {};

    } else {
        fs.writeFileSync(dir, "{}");
        return {};
    }

};

console.log("Parsing JSON file");

module.exports = method(config);