"use strict";

var rek = require('rekuire');

var bot = rek('/bot.js');
var events = bot.events;

function add(options) {
    var globalFlag = options.message[0] === "global" ? true : false;
    if (options.message[0] === "global") {
        options.message.splice(0, 1);
    }
    options.Model.create({
        channel: options.to,
        addedBy: options.from,
        addDate: Date.now(),
        global: globalFlag,
        dramaString: options.message.join(" ")
    }, function (err) {
        if (err) {
            console.log(err);
            events.emit("apiSay", options.to, err.message);
        } else {
            events.emit("apiSay", options.to, options.emitOnSuccess);
        }
    });
}



module.exports = {
    add: add
};
