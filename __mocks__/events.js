"use strict";
var events = require.requireActual('events'),
    emitter = new events.EventEmitter();

module.exports = emitter;