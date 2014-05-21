"use strict";
var _ = require('lodash'),
    events = require('../../core/events.js'),
    config = require('../../core/initialize/parseJSON.js');

var method = function alias(options) {

    if (_.has(config, options.message)) {
        var list = [],
            objList = [];
        _.forEach(config[options.message].aliases, function (property) {
            if (_.isObject(property)) {
                objList.push(property.alias);
            } else {
                list.push(property);
            }

        });
        var response = [
            list.length > 0 ? "Simple aliases for " + options.message + ": " + list.join(', ') : '',
            objList.length > 0 ? "Complex aliases for " + options.message + ": " + objList.join(', ') : ''
        ].join("\n\r");
        events.emit('apiSay', options.to, response);

    } else {
        events.emit('apiSay', options.to, 'Command not found.');
    }

};
method({
    to: '#nbot',
    from: 'palid',
    message: 'help'
});

var defaults = {
    description: {
        pl: ",alias [cmd]- Wyświetla listę aliasów dla komendy.",
        en: ",alias [cmd]- Lists all aliases for command."
    },
    aliases: [
        "aliases"
    ]
};


module.exports = {
    method: method,
    defaults: defaults
};