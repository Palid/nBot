"use strict";
var db = require('./');

function getChannel(channel) {
    if (channel) return db.channels[channel];
    else return db.channels;
}

function getUser(user) {
    if (user) return db.users[user];
    else return db.users;
}