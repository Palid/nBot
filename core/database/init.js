"use strict";
var _ = require('lodash'),
    mongoose = require('./config.js'),
    schemas = require('./index.js'),
    config = require('../../config/bot.js');

mongoose.connection.once('open', function () {
    if (_.isArray(config.options.root)) {
        _.forEach(config.options.root, function (value) {
            schemas.User.findOneAndUpdate({
                nick: value
            }, {
                $set: {
                    'permissions.group': 'root',
                    'permissions.level': 10
                }
            }, {
                upsert: true
            }, function (err, doc) {
                if (err) console.log(err);
                console.log("Creating root document for %s", value);
            });

        });
    } else {
        schemas.User.findOneAndUpdate({
            nick: config.options.root
        }, {
            $set: {
                'permissions.group': 'root',
                'permissions.level': 10
            }
        }, {
            upsert: true
        }, function (err, doc) {
            if (err) console.log(err);
            console.log("Creating root document for %s", config.options.root);
        });
    }

});