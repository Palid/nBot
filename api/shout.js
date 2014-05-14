"use strict";
var figlet = require('figlet'),
    events = require('../helpers/events.js');



var method = function shout(options) {
    var channel = options.to,
        data = options.message;

    figlet(data, function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        if (data.length > 500) {
            events.emit('apiReponse', channel, "String is too long.");
        } else {
            events.emit('apiResponse', channel, data.split('/n'));
        }
    });

    return {
        type: "async"
    };

};

var defaults = {
    description: {
        pl: ",shout [string] - Bot wykrzykuje [string].",
        en: ",shout [string] - Bot shouts [string]."
    },
    aliases: []
};


module.exports = {
    method: method,
    defaults: defaults
};